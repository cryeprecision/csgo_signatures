import { Box, Paper, Stack, Theme, useMediaQuery } from '@mui/material'
import { useState } from 'react'
import { Config, Signature, NetVar } from '../types/hazedumper'
import { paging } from '../types/paging'
import { Paging } from './Paging'
import Grid from '@mui/material/Unstable_Grid2'
import { MyTextField, MyAccordion, MyAccordionSummary, MyTypography, MyAccordionDetails } from './Base'

const formatOffset = (offset: number | undefined): string => {
  return offset !== undefined ? '0x' + offset.toString(16).toUpperCase().padStart(2, '0') : ''
}
const formatOffsets = (offsets: number[]): string => {
  return offsets.map(formatOffset).join(' -> ')
}

const HazedumperConfigSignature = ({ sig }: { sig: Signature }): JSX.Element => {
  return (
    <Paper elevation={4} sx={{ p: 1, display: 'flex', flexWrap: 'wrap', columnGap: 1 }}>
      <MyTextField label='Pattern' value={sig.pattern} />
      <MyTextField label='Module' value={sig.module} />
      <MyTextField label='Name' value={sig.name} />
      <MyTextField label='Offsets' value={formatOffsets(sig.offsets ?? [])} />
    </Paper>
  )
}

const HazedumperConfigNetVar = ({ netVar }: { netVar: NetVar }): JSX.Element => {
  return (
    <Paper elevation={4} sx={{ p: 1, display: 'flex', columnGap: 1 }}>
      <MyTextField label='Name' value={netVar.name} />
      <MyTextField label='Prop' value={netVar.prop} />
      <MyTextField label='Table' value={netVar.table} />
      <MyTextField label='Offset' value={formatOffset(netVar.offset)} />
    </Paper>
  )
}

const pageSizes = [5, 10, 25, 50, 100]

export const HazedumperConfig = ({ cfg }: { cfg: Config }): JSX.Element => {
  const [pageSize, setPageSize] = useState(pageSizes[0])
  const [page, setPage] = useState(1)

  const { pages, start, end } = paging(Math.max(cfg.netvars.length, cfg.signatures.length), pageSize, page)
  const reduced = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'))

  return (
    <Box sx={{ mx: { xs: 1, md: 2, lg: 8, xl: 32 } }}>
      <MyAccordion>
        <MyAccordionSummary>
          <Paper elevation={5} sx={{ p: 1, width: '100%' }}>
            <MyTypography title='Hazedumper Config' />
          </Paper>
        </MyAccordionSummary>
        <MyAccordionDetails>
          <Stack gap={1}>
            <Paper elevation={5}>
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
                  {cfg.netvars.slice(start, end).map(netVar => (
                    <HazedumperConfigNetVar netVar={netVar} key={netVar.name} />
                  ))}
                </Stack>
              </Grid>
              <Grid xs={6}>
                <Stack gap={1}>
                  {cfg.signatures.slice(start, end).map(sig => (
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
