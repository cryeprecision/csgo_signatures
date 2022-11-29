import './App.css'
import '@fontsource/roboto-mono'
import { memo, useEffect, useMemo, useState } from 'react'
import { createTheme, CssBaseline, ThemeProvider, useMediaQuery } from '@mui/material'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import styled from '@emotion/styled'
import { ClassInfo, FetchCallback, RawResourceMap, Resource, Signature } from './types/types'

import { AppBar } from './components/AppBar'
import { SignatureCollection } from './components/SignatureCollection'

const theme = createTheme({
  palette: {
    mode: 'dark',
  },
})

const urlPrefix = 'https://raw.githubusercontent.com/KittenPopo/csgo-offsets/site/rawsigdata/'
// const urlPrefix = './real_resources/'
// const urlPrefix = './test_resources/'

const resources: Resource[] = [
  { name: 'client', urlSuffix: 'client_funcs.c' },
  { name: 'engine', urlSuffix: 'engine_funcs.c' },
  { name: 'server', urlSuffix: 'server_funcs.c' },
  { name: 'filesystem_stdio', urlSuffix: 'filesystem_stdio_funcs.c' },
  { name: 'panorama', urlSuffix: 'panorama_funcs.c' },
  { name: 'panoramauiclient', urlSuffix: 'panoramauiclient_funcs.c' },
]

// `void test<pair<string, int>>()` => `void test<[...]>()`
// `pair<string, int> test<pair<string, int>>()` => `pair<[...]> test<[...]>()`
const omitTemplates = (name: string): string => {
  return name
}

const parseClassInfo = (name: string, vTableIndex: string): ClassInfo => {
  const first = name.indexOf('<')
  const last = name.lastIndexOf('>')
  if (first !== -1 && last !== -1 && first < last) {
    name = name.substring(0, first + 1) + '[...]' + name.substring(last)
  }
  return { name: name, vTableIndex: parseInt(vTableIndex) }
}

const parseSigName = (name: string): string => {
  // remove `virtual` because its usage is inconsistens and virtual functions can be recognized by the `ClassInfo`
  if (name.startsWith('virtual ')) name = name.substring(8)

  // remove templates that are just wrong
  const start = name.indexOf('<')
  if (start !== -1 && name.indexOf('>') === -1) name = name.substring(0, start)

  return name
}

const parseLine = (fileName: string, line: string, lineNr: number): Signature | null => {
  const splits = line.replace('\r', '').split('=')
  if (splits.length < 2) return null
  return {
    fileName: fileName,
    lineNr: lineNr,
    sigName: parseSigName(splits[0]),
    sig: splits[1],
    source: splits.length < 3 ? undefined : splits[2],
    classInfo: splits.length < 5 ? undefined : parseClassInfo(splits[3], splits[4]),
  }
}

const parseFile = (fileName: string, file: string): Signature[] => {
  let signatures: Signature[] = []
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
  let data: RawResourceMap = {}
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
    let buffer: Signature[] = []
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
