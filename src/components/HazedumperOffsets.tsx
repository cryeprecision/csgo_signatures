import { Box, Paper, Stack, Theme, useMediaQuery } from '@mui/material'
import { useState } from 'react'
import { Offset, Offsets } from '../types/hazedumper'
import { paging } from '../types/paging'
import { Paging } from './Paging'
import Grid from '@mui/material/Unstable_Grid2'
import { MyTextField, MyAccordion, MyAccordionSummary, MyTypography, MyAccordionDetails } from './Base'

const HazedumperOffset = ({ offset }: { offset: Offset }): JSX.Element => {
  return (
    <Grid xs={2}>
      <Paper elevation={5} sx={{ p: 1 }}>
        <MyTextField fullWidth label={offset.name} value={'0x' + offset.offset.toString(16).toUpperCase().padStart(8, '0')} />
      </Paper>
    </Grid>
  )
}

const pageSizes = [5, 10, 25, 50, 100]

export const HazedumperOffsets = ({ offsets }: { offsets: Offsets }): JSX.Element => {
  const [pageSize, setPageSize] = useState(10)
  const [page, setPage] = useState(1)

  const { pages, start, end } = paging(offsets.offsets.length, pageSize, page)
  const reduced = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'))
  const title = new Date(offsets.timestamp * 1000).toLocaleString()

  return (
    <Box sx={{ mx: { xs: 1, md: 2, lg: 8, xl: 32 } }}>
      <MyAccordion>
        <MyAccordionSummary>
          <Paper elevation={5} sx={{ p: 1, width: '100%', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
            <MyTypography title='Hazedumper Offsets' />
            <MyTypography title={'Last Update: ' + title} />
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
              {offsets.offsets.slice(start, end).map(offset => (
                <HazedumperOffset offset={offset} key={offset.name} />
              ))}
            </Grid>
          </Stack>
        </MyAccordionDetails>
      </MyAccordion>
    </Box>
  )
}
