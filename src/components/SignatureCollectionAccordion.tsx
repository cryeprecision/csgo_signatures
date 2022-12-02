import { Box, MenuItem, Pagination, Paper, Select, Stack, Typography } from '@mui/material'
import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material'
import { memo, useState } from 'react'
import { Signature } from '../types/types'
import { paging } from '../types/paging'

const SignatureItem = ({ sig }: { sig: Signature }): JSX.Element => {
  return (
    <Accordion>
      <AccordionSummary>
        <Typography fontFamily='Roboto Mono'>{sig.sigName}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Box>
          <Typography fontFamily='Roboto Mono' align='left' noWrap fontSize={10}>
            {`${sig.fileName}.dll -> ${sig.sig}`}
          </Typography>
          {sig.classInfo && <Typography fontFamily='Roboto Mono'>{`${sig.classInfo.name}[${sig.classInfo.vTableIndex}]`}</Typography>}
          {sig.source && <Typography fontFamily='Roboto Mono'>{sig.source}</Typography>}
        </Box>
      </AccordionDetails>
    </Accordion>
  )
}

const pageSizes: number[] = [5, 10, 25, 50, 100]

export const SignatureCollection = ({ sigs }: { sigs: Signature[] }): JSX.Element => {
  const [pageSize, setPageSize] = useState(pageSizes[1])
  const [page, setPage] = useState(1)

  const { pages, start, end } = paging(sigs.length, pageSize, page)

  return (
    <>
      <Paper elevation={2} sx={{ m: 1 }}>
        <Box display='flex' justifyContent='space-between' alignItems='center' sx={{ p: 1 }}>
          <Box sx={{ p: 1 }}>
            <Pagination size='large' count={pages} showFirstButton showLastButton onChange={(_event, page) => setPage(page)} />
          </Box>
          <Box>
            <Select value={pageSize} sx={{ minWidth: 200 }} onChange={({ target }) => setPageSize(target.value as number)}>
              {pageSizes.map(size => (
                <MenuItem key={size} value={size}>
                  {size.toString()}
                </MenuItem>
              ))}
            </Select>
          </Box>
        </Box>
      </Paper>
      <Stack sx={{ mb: 2, mx: 2 }}>
        {sigs.slice(start, end).map(sig => (
          <SignatureItem sig={sig} />
        ))}
      </Stack>
    </>
  )
}
