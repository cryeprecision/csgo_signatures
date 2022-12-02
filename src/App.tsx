import './App.css'
import '@fontsource/roboto-mono'
import { useEffect, useMemo, useState } from 'react'
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
    loadSignaturesRepo(),
  ])
  console.timeEnd('fetchAllResources')
  return {
    hazedumperConfig: config,
    hazedumperOffsets: offsets,
    kittenpopoSignatures: mergeSignatures(sigsSite, sigsRepo),
  }
}

const matchesSearch = (sig: Signature, search: string): boolean => {
  if (search === '') return true
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

  const filteredSigs = useMemo((): Signature[] => {
    return (data?.kittenpopoSignatures ?? []).filter(sig => matchesSearch(sig, search))
  }, [search, data])

  const sigCount = data?.kittenpopoSignatures.length ?? 0
  const appState = loading ? 'Loading' : error ? 'Error: ' + error.message : data ? 'Done' : 'Undefined'

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline enableColorScheme />
      <AppBar appState={appState} sigsLoaded={sigCount} sigsMatched={filteredSigs.length} setSearch={setSearch} />
      <Stack gap={1}>
        {data && <HazedumperOffsets offsets={data.hazedumperOffsets} />}
        {data && <HazedumperConfig cfg={data.hazedumperConfig} />}
        {filteredSigs && <SignatureCollection sigs={filteredSigs} />}
      </Stack>
    </ThemeProvider>
  )
}
