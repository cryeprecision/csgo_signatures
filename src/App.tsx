import './App.css'
import { memo, useEffect, useMemo, useState } from 'react'
import { createTheme, CssBaseline, ThemeProvider, useMediaQuery } from '@mui/material'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import styled from '@emotion/styled'
import { FetchCallback, RawResourceMap, Resource, Signature } from './types/types'

import { AppBar } from './components/AppBar'
import { SignatureCollection } from './components/SignatureCollection'

const theme = createTheme({
  palette: {
    mode: 'dark',
  },
})

const urlPrefix = 'https://raw.githubusercontent.com/KittenPopo/csgo-offsets/site/rawsigdata/'
// const urlPrefix = './'

const resources: Resource[] = [
  { name: 'client', urlSuffix: 'client_funcs.c' },
  { name: 'engine', urlSuffix: 'engine_funcs.c' },
  { name: 'server', urlSuffix: 'server_funcs.c' },
  { name: 'filesystem_stdio', urlSuffix: 'filesystem_stdio_funcs.c' },
  { name: 'panorama', urlSuffix: 'panorama_funcs.c' },
  { name: 'panoramauiclient', urlSuffix: 'panoramauiclient_funcs.c' },
]

const parseLine = (fileName: string, line: string, lineNr: number): Signature | null => {
  const splits = line.replace('\r', '').split('=')
  if (splits.length < 2) return null
  return {
    fileName: fileName,
    lineNr: lineNr,
    sigName: splits[0],
    sig: splits[1],
    source: splits.length < 3 ? undefined : splits[2],
    classInfo: splits.length < 5 ? undefined : { name: splits[3], vTableIndex: parseInt(splits[4]) },
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
  return (
    sig.sigName.includes(search) ||
    sig.sig.includes(search) ||
    sig.fileName.includes(search) ||
    (sig.source !== undefined && sig.source.includes(search)) ||
    (sig.classInfo !== undefined && (sig.classInfo.name.includes(search) || sig.classInfo.vTableIndex.toString().includes(search)))
  )
}

export const App = () => {
  const [rawData, setRawData] = useState<RawResourceMap>()
  const [error, setError] = useState<Error>()

  const [loading, setLoading] = useState<boolean>(false)
  const [fetched, setFetched] = useState<string[]>([])

  const [search, setSearch] = useState<string>('')

  useEffect(() => {
    const controller = new AbortController()

    setLoading(true)
    setFetched([])
    setError(undefined)
    setRawData(undefined)

    fetchAllResources(controller.signal, (name, _index) => {
      setFetched(current => [...current, name])
    })
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
