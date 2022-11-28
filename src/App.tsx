import './App.css'
import { memo, useEffect, useMemo, useState } from 'react'
import { createTheme, CssBaseline, ThemeProvider, useMediaQuery } from '@mui/material'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import styled from '@emotion/styled'
import { FetchCallback, RawResourceMap, Resource, ResourceMap, Signature } from './types/types'

import { AppBar } from './components/AppBar'
import { SignatureCollection } from './components/SignatureCollection'

const theme = createTheme({
  palette: {
    mode: 'dark',
  },
})

const urlPrefix = 'https://raw.githubusercontent.com/KittenPopo/csgo-offsets/site/rawsigdata/'

const resources: Resource[] = [
  { name: 'client', urlSuffix: 'client_funcs.c' },
  { name: 'engine', urlSuffix: 'engine_funcs.c' },
  { name: 'server', urlSuffix: 'server_funcs.c' },
  { name: 'filesystem_stdio', urlSuffix: 'filesystem_stdio_funcs.c' },
  { name: 'panorama', urlSuffix: 'panorama_funcs.c' },
  { name: 'panoramauiclient', urlSuffix: 'panoramauiclient_funcs.c' },
]

const parseLine = (line: string): Signature | null => {
  const splits = line.replace('\r', '').split('=')
  if (splits.length < 2) return null
  return {
    name: splits[0],
    sig: splits[1],
    source: splits.length < 3 ? undefined : splits[2],
    classInfo: splits.length < 5 ? undefined : { name: splits[3], vTableIndex: parseInt(splits[4]) },
  }
}

const parseFile = (file: string): Signature[] => {
  let signatures: Signature[] = []
  file.split('\n').forEach(line => {
    const parsed = parseLine(line)
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

const countSignatures = (map: ResourceMap): number => {
  return Object.values(map).reduce((acc, next): number => acc + next.length, 0)
}

const matchesSearch = (sig: Signature, search: string): boolean => {
  return (
    sig.name.includes(search) ||
    sig.sig.includes(search) ||
    (sig.source !== undefined && sig.source.includes(search)) ||
    (sig.classInfo !== undefined && (sig.classInfo.name.includes(search) || sig.classInfo.vTableIndex.toString().includes(search)))
  )
}

const StyledDataGrid = styled(DataGrid)(({ theme: Theme }) => ({
  '& .MuiDataGrid-iconSeparator': {
    display: 'none',
  },
}))

export const App = () => {
  const [loading, setLoading] = useState<boolean>(false)
  const [fetched, setFetched] = useState<string[]>([])
  const [data, setData] = useState<RawResourceMap>()
  const [error, setError] = useState<Error>()
  const [search, setSearch] = useState<string>('')

  useEffect(() => {
    const controller = new AbortController()

    setLoading(true)
    setFetched([])
    setError(undefined)
    setData(undefined)

    fetchAllResources(controller.signal, (name, _index) => {
      setFetched(current => [...current, name])
    })
      .then(fetched => {
        setData(fetched)
        setError(undefined)
      })
      .catch(error => setError(error))
      .finally(() => setLoading(false))

    return () => controller.abort()
  }, [])

  const parsedData = useMemo((): ResourceMap | null => {
    if (data === undefined) return null
    let parsed: ResourceMap = {}
    for (const name of Object.keys(data)) {
      parsed[name] = parseFile(data[name])
    }
    return parsed
  }, [data])

  const filtered = useMemo((): ResourceMap | null => {
    if (parsedData === null) return null
    let filtered_: ResourceMap = {}
    for (const [name, signatures] of Object.entries(parsedData)) {
      filtered_[name] = signatures.filter(signature => matchesSearch(signature, search))
    }
    return filtered_
  }, [parsedData, search])

  const filteredLimited = useMemo((): ResourceMap | null => {
    if (filtered === null) return null
    let filtered_: ResourceMap = {}
    for (const [name, signatures] of Object.entries(filtered)) {
      filtered_[name] = signatures.slice(0, 10)
    }
    return filtered_
  }, [filtered])

  const signaturesLoaded = useMemo((): number => {
    if (parsedData === null) return 0
    return countSignatures(parsedData)
  }, [parsedData])
  const signaturesMatched = useMemo((): number => {
    if (filtered === null) return 0
    return countSignatures(filtered)
  }, [filtered])

  const appState = loading ? 'Loading' : error ? 'Error: ' + error.message : data ? 'Done' : 'Undefined'

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline enableColorScheme />
      <AppBar appState={appState} sigsLoaded={signaturesLoaded} sigsMatched={signaturesMatched} setSearch={setSearch} />
      {filtered && <SignatureCollection sigs={filtered} />}
    </ThemeProvider>
  )
}
