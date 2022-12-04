import { Box, Paper, Stack, Theme, useMediaQuery } from '@mui/material'
import { useMemo, useState } from 'react'
import { Config, Signature, NetVar, matchesSearchNetVar, matchesSearchSignature } from '../types/hazedumper'
import { paging } from '../types/paging'
import { Paging } from './Paging'
import Grid from '@mui/material/Unstable_Grid2'
import { MyTextField, MyAccordion, MyAccordionSummary, MyTypography, MyAccordionDetails, MyAccordionTitle } from './Base'

const formatOffset = (offset: number | undefined): string => {
  return offset !== undefined ? '0x' + offset.toString(16).toUpperCase().padStart(2, '0') : ''
}
const formatOffsets = (offsets: number[]): string => {
  return offsets.map(formatOffset).join(' -> ')
}

const GridTextField = (props: { label: string; value: string }): JSX.Element => {
  return (
    <Grid xs={12} md={6}>
      <MyTextField fullWidth {...props} />
    </Grid>
  )
}

const HazedumperConfigSignature = ({ sig }: { sig: Signature }): JSX.Element => {
  return (
    <Paper elevation={2} sx={{ p: 1 }}>
      <Grid container spacing={1}>
        <GridTextField label='Pattern' value={sig.pattern} />
        <GridTextField label='Module' value={sig.module} />
        <GridTextField label='Name' value={sig.name} />
        <GridTextField label='Offsets' value={formatOffsets(sig.offsets ?? [])} />
      </Grid>
    </Paper>
  )
}

const HazedumperConfigNetVar = ({ netVar }: { netVar: NetVar }): JSX.Element => {
  return (
    <Paper elevation={2} sx={{ p: 1 }}>
      <Grid container spacing={1}>
        <GridTextField label='Name' value={netVar.name} />
        <GridTextField label='Prop' value={netVar.prop} />
        <GridTextField label='Table' value={netVar.table} />
        <GridTextField label='Offset' value={formatOffset(netVar.offset)} />
      </Grid>
    </Paper>
  )
}

const pageSizes = [5, 10, 25, 50, 100]

export const HazedumperConfig = ({ cfg, search }: { cfg: Config; search: string }): JSX.Element => {
  const [pageSize, setPageSize] = useState(pageSizes[0])
  const [page, setPage] = useState(1)
  const reduced = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'))

  const [filteredNetVars, filteredSigs] = useMemo(() => {
    const search_ = search.toLowerCase()
    return [
      cfg.netvars.filter(netVar => matchesSearchNetVar(netVar, search_)),
      cfg.signatures.filter(sig => matchesSearchSignature(sig, search_)),
    ]
  }, [cfg, search])

  const { pages, start, end } = paging(Math.max(filteredNetVars.length, filteredSigs.length), pageSize, page)

  return (
    <Box sx={{ mx: { xs: 1, md: 2, lg: 8, xl: 32 } }}>
      <MyAccordion>
        <MyAccordionSummary>
          <MyAccordionTitle elevation={2}>
            <MyTypography title='Hazedumper Config' />
          </MyAccordionTitle>
        </MyAccordionSummary>
        <MyAccordionDetails>
          <Stack gap={1}>
            <Paper elevation={2}>
              <Paging
                pages={pages}
                size='large'
                pageSize={pageSize}
                setPageSize={setPageSize}
                pageSizes={pageSizes}
                setPage={setPage}
                reduced={reduced}
              />
            </Paper>

            <Grid container spacing={1}>
              <Grid xs={6}>
                <Stack gap={1}>
                  {filteredNetVars.slice(start, end).map(netVar => (
                    <HazedumperConfigNetVar netVar={netVar} key={netVar.name} />
                  ))}
                </Stack>
              </Grid>
              <Grid xs={6}>
                <Stack gap={1}>
                  {filteredSigs.slice(start, end).map(sig => (
                    <HazedumperConfigSignature sig={sig} key={sig.name} />
                  ))}
                </Stack>
              </Grid>
            </Grid>
          </Stack>
        </MyAccordionDetails>
      </MyAccordion>
    </Box>
  )
}
