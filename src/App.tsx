import './App.css'
import '@fontsource/roboto-mono'

import { useEffect, useState } from 'react'
import { createTheme, CssBaseline, Stack, ThemeProvider } from '@mui/material'

import { AppBar } from './components/AppBar'
import { SignatureCollection } from './components/SignatureCollection'
import { Config, loadConfig, loadOffsets, Offsets } from './types/hazedumper'
import { loadSignaturesSite, Signature } from './types/kittenpopo_site'
import { HazedumperOffsets } from './components/HazedumperOffsets'
import { HazedumperConfig } from './components/HazedumperConfig'
import { loadSignaturesRepo } from './types/kittenpopo_repo'
import { mergeSignatures } from './types/kittenpopo_merge'

const theme = createTheme({
  palette: {
    mode: 'dark',
  },
})

type Data = {
  hazedumperConfig: Config
  hazedumperOffsets: Offsets
  kittenpopoSignatures: Signature[]
}

const fetchAllResources = async (signal: AbortSignal): Promise<Data> => {
  console.time('fetchAllResources')
  const [config, offsets, sigsSite, sigsRepo] = await Promise.all([
    loadConfig(signal),
    loadOffsets(signal),
    loadSignaturesSite(signal),
    loadSignaturesRepo(signal),
  ])
  console.timeEnd('fetchAllResources')

  mergeSignatures(sigsSite, sigsRepo)

  return {
    hazedumperConfig: config,
    hazedumperOffsets: offsets,
    kittenpopoSignatures: sigsSite,
  }
}

export const App = () => {
  const [data, setData] = useState<Data | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [search, setSearch] = useState<string>('')

  useEffect(() => {
    const controller = new AbortController()
    setLoading(true)

    fetchAllResources(controller.signal)
      .then(data => {
        setData(data)
        setError(null)
      })
      .catch(error => {
        setData(null)
        setError(error)
      })
      .finally(() => {
        setLoading(false)
      })

    return () => controller.abort()
  }, [])

  const appState = loading ? 'Loading' : error ? 'Error: ' + error.message : data ? 'Done' : 'Undefined'

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline enableColorScheme />
      <AppBar appState={appState} setSearch={setSearch} />
      <Stack gap={1}>
        {data && <SignatureCollection sigs={data.kittenpopoSignatures} search={search} />}
        {data && <HazedumperConfig cfg={data.hazedumperConfig} search={search} />}
        {data && <HazedumperOffsets offsets={data.hazedumperOffsets} search={search} />}
      </Stack>
    </ThemeProvider>
  )
}
