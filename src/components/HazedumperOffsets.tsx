import { Box, Paper, Stack, Theme, useMediaQuery } from '@mui/material'
import { useMemo, useState } from 'react'
import { matchesSearchOffset, Offset, Offsets } from '../types/hazedumper'
import { paging } from '../types/paging'
import { Paging } from './Paging'
import Grid from '@mui/material/Unstable_Grid2'
import { MyTextField, MyAccordion, MyAccordionSummary, MyTypography, MyAccordionDetails, MyAccordionTitle } from './Base'

const HazedumperOffset = ({ offset }: { offset: Offset }): JSX.Element => {
  return (
    <Grid xs={6} md={4} lg={3}>
      <Paper elevation={2} sx={{ p: 1 }}>
        <MyTextField fullWidth label={offset.name} value={'0x' + offset.offset.toString(16).toUpperCase().padStart(8, '0')} />
      </Paper>
    </Grid>
  )
}

const pageSizes = [4, 12, 25, 50, 100]

export const HazedumperOffsets = ({ offsets, search }: { offsets: Offsets; search: string }): JSX.Element => {
  const [pageSize, setPageSize] = useState(pageSizes[1])
  const [page, setPage] = useState(1)

  const filteredOffsets = useMemo(() => {
    const search_ = search.toLowerCase()
    return offsets.offsets.filter(offset => matchesSearchOffset(offset, search_))
  }, [offsets, search])

  const { pages, start, end } = paging(filteredOffsets.length, pageSize, page)
  const reduced = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'))
  const title = new Date(offsets.timestamp * 1000).toLocaleString()

  return (
    <Box sx={{ mx: { xs: 1, md: 2, lg: 8, xl: 32 } }}>
      <MyAccordion>
        <MyAccordionSummary>
          <MyAccordionTitle elevation={2} sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
            <MyTypography title='Hazedumper Offsets' />
            <MyTypography title={'Last Update: ' + title} />
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
              {filteredOffsets.slice(start, end).map(offset => (
                <HazedumperOffset offset={offset} key={offset.name} />
              ))}
            </Grid>
          </Stack>
        </MyAccordionDetails>
      </MyAccordion>
    </Box>
  )
}
