import { FC, useEffect, useMemo, useRef, useState } from 'react'
import './App.css'
import { Chip, createTheme, CssBaseline, Divider, Paper, Stack, ThemeProvider } from '@mui/material'
import { Box, TextField, Typography } from '@mui/material'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import Grid from '@mui/material/Unstable_Grid2'
import styled from '@emotion/styled'
import { FixedSizeList as List, ListChildComponentProps } from 'react-window'
import AutoSizer, { Size } from 'react-virtualized-auto-sizer'

const theme = createTheme({
  palette: {
    mode: 'dark',
  },
})

const urlPrefix = 'https://raw.githubusercontent.com/KittenPopo/csgo-offsets/site/rawsigdata/'

type Resource = {
  name: string
  urlSuffix: string
}

type FetchCallback = (name: string, index: number) => void

type Signature = {
  name: string
  sig: string
  source?: string
  vTableIdx?: number
}

const columns: GridColDef[] = [
  {
    field: 'name',
    headerName: 'Name',
    sortable: false,
    flex: 1,
  },
  {
    field: 'sig',
    headerName: 'Signature',
    sortable: false,
    flex: 3,
  },
]

type RawResourceMap = { [key: string]: string }
type ResourceMap = { [key: string]: Signature[] }

const resources: Resource[] = [
  { name: 'client', urlSuffix: 'client_funcs.c' },
  { name: 'engine', urlSuffix: 'engine_funcs.c' },
  { name: 'server', urlSuffix: 'server_funcs.c' },
  { name: 'filesystem_stdio', urlSuffix: 'filesystem_stdio_funcs.c' },
  { name: 'panorama', urlSuffix: 'panorama_funcs.c' },
  { name: 'panoramauiclient', urlSuffix: 'panoramauiclient_funcs.c' },
]

const parseLine = (line: string): Signature | null => {
  const splits = line.split('=')
  if (splits.length < 2) return null
  return {
    name: splits[0],
    sig: splits[1],
    source: splits.length < 3 ? undefined : splits[2],
    vTableIdx: splits.length < 4 ? undefined : parseInt(splits[3]),
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
  return sig.name.includes(search) || sig.sig.includes(search)
}

const StyledDataGrid = styled(DataGrid)(({ theme: Theme }) => ({
  '& .MuiDataGrid-iconSeparator': {
    display: 'none',
  },
}))

const SignatureItem = (sig: Signature): JSX.Element => {
  return (
    <Paper elevation={2} sx={{ mb: 1, p: 2 }}>
      <Typography fontFamily='Roboto Mono' align='left'>
        {sig.name}
      </Typography>
      <Divider sx={{ my: 1 }} />
      <Typography fontFamily='Roboto Mono' align='left' fontSize={10}>
        {sig.sig.length < 25 ? sig.sig : sig.sig.substring(0, 40).trimEnd() + '...'}
      </Typography>
    </Paper>
  )
}

const FileItem = ([name, sigs]: [string, Signature[]]): JSX.Element | undefined => {
  if (sigs.length === 0) return undefined
  return (
    <Grid xs={12} md={6} xl={4}>
      <Paper sx={{ p: 1 }}>
        <Chip variant='outlined' sx={{ p: 1, mb: 1 }} label={name} />
        <Stack>{sigs.map(SignatureItem)}</Stack>
      </Paper>
    </Grid>
  )
}

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

  const appState = loading ? 'Loading' : error ? 'Error: ' + error.message : data ? 'Done' : 'Undefined'

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline enableColorScheme />
      <Box>
        <Typography variant='h1'>CS:GO Signatures</Typography>
        <Typography variant='h4'>App State: {appState}</Typography>
        <Typography variant='h4'>Loaded {signaturesLoaded} Signatures</Typography>
        <Typography variant='h4'>Fetched: {fetched.join(', ')}</Typography>
        <TextField onChange={({ target }) => setSearch(target.value)} id='outlined-basic' label='Search Signatures' variant='outlined' />

        {filtered !== null && filteredLimited !== null && (
          <>
            <Typography variant='h2'>Matches: {countSignatures(filtered)}</Typography>
            <Grid container spacing={1}>
              {Object.entries(filteredLimited).map(FileItem)}
            </Grid>
          </>
        )}
      </Box>
    </ThemeProvider>
  )
}

// const SignatureItem = ({ index, style }: ListChildComponentProps): JSX.Element => {
//     if (filteredFlat === null) return <></>
//     return (
//       <Paper elevation={2} style={style} sx={{ m: 2, p: 2 }}>
//         <Typography variant='body1'>{filteredFlat[index].name}</Typography>
//         <Typography variant='body2'>{filteredFlat[index].sig}</Typography>
//       </Paper>
//     )
//   }
// <AutoSizer>
// {({ width, height }: Size) => (
//   <List width={width} height={height} itemCount={filteredFlat.length} itemSize={60}>
//     {SignatureItem}
//   </List>
// )}
// </AutoSizer>

// <Grid container spacing={2}>
// {Object.entries(filtered).map(([name, signatures]) => {
//   return (
//     <Grid xs={6} key={name}>
//       <Paper>
//         <StyledDataGrid
//           autoHeight={true}
//           rows={signatures}
//           pageSize={10}
//           rowsPerPageOptions={[10]}
//           getRowId={row => row.name}
//           columns={columns}
//           disableSelectionOnClick
//           disableColumnMenu
//           density='compact'
//         />
//       </Paper>
//     </Grid>
//   )
// })}
// </Grid>
