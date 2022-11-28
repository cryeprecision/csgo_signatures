import { Theme } from '@emotion/react'
import {
  Box,
  Chip as Chip_,
  Collapse,
  Divider,
  IconButton,
  MenuItem,
  Pagination,
  Paper,
  Select,
  Stack,
  SxProps,
  Typography,
} from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import { memo, useEffect, useMemo, useState } from 'react'
import { FileSignature, ResourceMap, Signature, toFileSignatures } from '../types/types'
import { ExpandMore, ExpandLess } from '@mui/icons-material'
type ChipProps = {
  label: string
}

type SetOpen = React.Dispatch<React.SetStateAction<boolean[]>>

type SignatureItemProps = {
  sig: FileSignature
  open: boolean[]
  setOpen: SetOpen
  index: number
}

const SignatureItem = ({ sig, open, setOpen, index }: SignatureItemProps): JSX.Element => {
  return (
    <Paper elevation={2} sx={{ mb: 1, mx: 1, p: 2 }}>
      <Box display='flex' alignItems='center'>
        <IconButton
          size='large'
          sx={{ mr: 2 }}
          onClick={() => {
            setOpen(prev => prev.map((prev_, index_) => (index_ === index ? !prev_ : prev_)))
          }}
        >
          {open[index] ? <ExpandLess /> : <ExpandMore />}
        </IconButton>
        <Box>
          <Typography fontFamily='Roboto Mono' align='left'>
            {sig.name}
          </Typography>
        </Box>
      </Box>
      <Collapse in={open[index]} unmountOnExit>
        <Box sx={{ mt: 2 }}>
          <Typography fontFamily='Roboto Mono' noWrap>
            {`${sig.file}.dll -> ${sig.sig}`}
          </Typography>
          {sig.classInfo && (
            <Typography fontFamily='Roboto Mono' noWrap>
              {`${sig.classInfo.name}[${sig.classInfo.vTableIndex}]`}
            </Typography>
          )}
          <Typography fontFamily='Roboto Mono' noWrap>
            {`${sig.source}`}
          </Typography>
        </Box>
      </Collapse>
    </Paper>
  )
}

export type SignatureCollectionProps = {
  sigs: ResourceMap
}

const pageSizes: number[] = [5, 10, 25, 50, 100]

const ActualCollection = ({ sigs, open, setOpen }: { sigs: FileSignature[]; open: boolean[]; setOpen: SetOpen }): JSX.Element => {
  return (
    <Stack sx={{ mb: 2 }}>
      {sigs.map((sig, index) => (
        <SignatureItem sig={sig} open={open} setOpen={setOpen} index={index} key={index} />
      ))}
    </Stack>
  )
}

export const SignatureCollection = ({ sigs }: SignatureCollectionProps): JSX.Element => {
  const flatSigs = useMemo((): FileSignature[] => toFileSignatures(sigs), [sigs])
  const [pageSize, setPageSize] = useState(10)
  const [page, setPage] = useState(1)
  const [start, end] = useMemo((): [number, number] => {
    const page_ = Math.min(page, Math.floor((flatSigs.length + pageSize) / pageSize))
    return [(page_ - 1) * pageSize, page_ * pageSize]
  }, [pageSize, page, flatSigs])
  const actualSigs = useMemo((): FileSignature[] => flatSigs.slice(start, end), [flatSigs, start, end])
  const [open, setOpen] = useState<boolean[]>(Array(pageSize).fill(false))

  useEffect(() => {
    setOpen(Array(pageSize).fill(false))
  }, [page, pageSize, actualSigs])

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
      <ActualCollection sigs={actualSigs} open={open} setOpen={setOpen} />
    </>
  )
}
