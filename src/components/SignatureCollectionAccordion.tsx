import { Theme } from '@emotion/react'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Chip as Chip_,
  MenuItem,
  Pagination,
  Paper,
  Select,
  Stack,
  Typography,
} from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import { memo, useMemo, useState } from 'react'
import { FileSignature, ResourceMap, Signature, toFileSignatures } from '../types/types'

const SignatureItem_ = ({ sig }: { sig: FileSignature }): JSX.Element => {
  return (
    <Accordion>
      <AccordionSummary>
        <Typography fontFamily='Roboto Mono'>{sig.name}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Box>
          <Typography fontFamily='Roboto Mono' align='left' noWrap fontSize={10}>
            {`${sig.file}.dll -> ${sig.sig}`}
          </Typography>
          {sig.classInfo && <Typography fontFamily='Roboto Mono'>{`${sig.classInfo.name}[${sig.classInfo.vTableIndex}]`}</Typography>}
          {sig.source && <Typography fontFamily='Roboto Mono'>{sig.source}</Typography>}
        </Box>
      </AccordionDetails>
    </Accordion>
  )
}

const SignatureItem = memo(SignatureItem_)

export type SignatureCollectionProps = {
  sigs: ResourceMap
}

const pageSizes: number[] = [5, 10, 25, 50, 100]

const SignatureCollection_ = ({ sigs }: SignatureCollectionProps): JSX.Element => {
  const flatSigs = useMemo((): FileSignature[] => toFileSignatures(sigs), [sigs])
  const [pageSize, setPageSize] = useState(10)
  const [page, setPage] = useState(1)
  const [start, end] = useMemo((): [number, number] => {
    const page_ = Math.min(page, Math.floor((flatSigs.length + pageSize) / pageSize))
    return [(page_ - 1) * pageSize, page_ * pageSize]
  }, [pageSize, page, flatSigs])
  const actualSigs = useMemo((): FileSignature[] => flatSigs.slice(start, end), [flatSigs, start, end])

  return (
    <>
      <Paper elevation={2} sx={{ m: 1 }}>
        <Box display='flex' justifyContent='space-between' alignItems='center' sx={{ p: 1 }}>
          <Box sx={{ p: 1 }}>
            <Pagination
              size='large'
              count={Math.floor((flatSigs.length + pageSize) / pageSize)}
              showFirstButton
              showLastButton
              onChange={(_event, page) => setPage(page)}
            />
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
        {actualSigs.map(sig => (
          <SignatureItem sig={sig} />
        ))}
      </Stack>
    </>
  )
}

export const SignatureCollection = memo(SignatureCollection_)
