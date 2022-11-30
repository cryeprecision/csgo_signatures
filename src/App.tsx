import './App.css'
import '@fontsource/roboto-mono'
import { useEffect, useMemo, useState } from 'react'
import { createTheme, CssBaseline, ThemeProvider } from '@mui/material'
import { ClassInfo, FetchCallback, RawResourceMap, Resource, Signature } from './types/types'

import { AppBar } from './components/AppBar'
import { SignatureCollection } from './components/SignatureCollection'
import { omitBrackets } from './utility/omit_templates'

const theme = createTheme({
  palette: {
    mode: 'dark',
  },
})

// const urlPrefix = 'https://raw.githubusercontent.com/KittenPopo/csgo-offsets/site/rawsigdata/'
const urlPrefix = './real_resources/'
// const urlPrefix = './test_resources/'

const resources: Resource[] = [
  { name: 'client', urlSuffix: 'client_funcs.c' },
  { name: 'engine', urlSuffix: 'engine_funcs.c' },
  { name: 'server', urlSuffix: 'server_funcs.c' },
  { name: 'filesystem_stdio', urlSuffix: 'filesystem_stdio_funcs.c' },
  { name: 'panorama', urlSuffix: 'panorama_funcs.c' },
  { name: 'panoramauiclient', urlSuffix: 'panoramauiclient_funcs.c' },
]

const omitBrackets_ = (text: string): string | null => omitBrackets(text, ['<', '>'], 1, '[...]', 10)

const compactClassName = (name: string): string | undefined => {
  let omitted: string = name

  omitted = omitBrackets_(name) ?? 'INVALID'

  return omitted === name ? undefined : omitted
}

const parseClassInfo = (name: string, vTableIndex: string): ClassInfo => {
  return { name: name, nameCompact: compactClassName(name), vTableIndex: parseInt(vTableIndex) }
}

const compactSigName = (name: string): string | undefined => {
  let omitted: string = name

  // remove `virtual ` prefix
  if (omitted.startsWith('virtual ')) omitted = omitted.substring(8)

  // remove templates that are just wrong
  const start = omitted.indexOf('<')
  if (start !== -1 && omitted.indexOf('>') === -1) omitted = omitted.substring(0, start)

  omitted = omitBrackets_(omitted) ?? 'INVALID'

  return omitted === name ? undefined : omitted
}

const parseLine = (fileName: string, line: string, lineNr: number): Signature | null => {
  const splits = line.replace('\r', '').split('=')
  if (splits.length < 2) return null
  return {
    fileName: fileName,
    lineNr: lineNr,
    sigName: splits[0],
    sigNameCompact: compactSigName(splits[0]),
    sig: splits[1],
    source: splits.length < 3 ? undefined : splits[2],
    classInfo: splits.length < 5 ? undefined : parseClassInfo(splits[3], splits[4]),
  }
}

const parseFile = (fileName: string, file: string): Signature[] => {
  const signatures: Signature[] = []
  file.split('\n').forEach((line, index) => {
    const parsed = parseLine(fileName, line, index)
    if (parsed !== null) signatures.push(parsed)
  })
  return signatures
}

const fetchResource = async (resource: Resource, signal: AbortSignal): Promise<string> => {
  const response = await fetch(urlPrefix + resource.urlSuffix, { signal })
  if (!response.ok) throw new Error('response-code not 200')
  return response.text()
}

const fetchAllResources = async (signal: AbortSignal, callback?: FetchCallback): Promise<RawResourceMap> => {
  const data: RawResourceMap = {}
  const files = await Promise.all(
    resources.map((resource, index) =>
      fetchResource(resource, signal).then((file): [string, string] => {
        callback?.(resource.name, index)
        return [resource.name, file]
      }),
    ),
  )
  for (const [name, text] of files) {
    data[name] = text
  }
  return data
}

const matchesSearch = (sig: Signature, search: string): boolean => {
  const search_ = search.toLowerCase()
  return (
    sig.sigName.toLowerCase().includes(search_) ||
    sig.sig.toLowerCase().includes(search_) ||
    sig.fileName.toLowerCase().includes(search_) ||
    (sig.source !== undefined && sig.source.toLowerCase().includes(search_)) ||
    (sig.classInfo !== undefined &&
      (sig.classInfo.name.toLowerCase().includes(search_) || sig.classInfo.vTableIndex.toString().includes(search_)))
  )
}

export const App = () => {
  const [rawData, setRawData] = useState<RawResourceMap>()
  const [error, setError] = useState<Error>()
  const [loading, setLoading] = useState<boolean>(false)
  const [search, setSearch] = useState<string>('')

  useEffect(() => {
    const controller = new AbortController()

    setLoading(true)
    setError(undefined)
    setRawData(undefined)

    fetchAllResources(controller.signal)
      .then(fetched => {
        setRawData(fetched)
        setError(undefined)
      })
      .catch(error => setError(error))
      .finally(() => setLoading(false))

    return () => controller.abort()
  }, [])

  const parsedData = useMemo((): Signature[] => {
    if (rawData === undefined) return []
    const buffer: Signature[] = []
    for (const name of Object.keys(rawData)) {
      buffer.push(...parseFile(name, rawData[name]))
    }
    return buffer
  }, [rawData])

  const filtered = useMemo((): Signature[] => {
    return parsedData.filter(sig => matchesSearch(sig, search))
  }, [parsedData, search])

  const appState = loading ? 'Loading' : error ? 'Error: ' + error.message : rawData ? 'Done' : 'Undefined'

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline enableColorScheme />
      <AppBar appState={appState} sigsLoaded={parsedData.length} sigsMatched={filtered.length} setSearch={setSearch} />
      {filtered && <SignatureCollection sigs={filtered} />}
    </ThemeProvider>
  )
}
