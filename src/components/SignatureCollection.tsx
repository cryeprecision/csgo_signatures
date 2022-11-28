import { Theme } from '@emotion/react'
import { Box, Collapse, IconButton, MenuItem, Pagination, Paper, Select, Stack, Typography } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import { memo, useEffect, useMemo, useState } from 'react'
import { Signature } from '../types/types'
import { ExpandMore, ExpandLess } from '@mui/icons-material'
import * as Sig from './Signature'

type SetOpen = React.Dispatch<React.SetStateAction<boolean[]>>

type SignatureItemProps = {
  sig: Signature
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
          sx={{ mr: 2, alignSelf: 'start' }}
          onClick={() => {
            setOpen(prev => prev.map((prev_, index_) => (index_ === index ? !prev_ : prev_)))
          }}
        >
          {open[index] ? <ExpandLess /> : <ExpandMore />}
        </IconButton>
        <Box>
          <Sig.MySignatureName sig={sig} />
          <Collapse in={open[index]} unmountOnExit>
            <Box sx={{ mt: 2 }}>
              <Sig.MySignatureName sig={sig} />
              <Sig.MySignature sig={sig} />
              <Sig.MyClassInfo sig={sig} />
              <Sig.MySource sig={sig} />
            </Box>
          </Collapse>
        </Box>
      </Box>
    </Paper>
  )
}

const pageSizes: number[] = [5, 10, 25, 50, 100]

const ActualCollection = ({ sigs, open, setOpen }: { sigs: Signature[]; open: boolean[]; setOpen: SetOpen }): JSX.Element => {
  return (
    <Stack sx={{ mb: 2 }}>
      {sigs.map((sig, index) => (
        <SignatureItem sig={sig} open={open} setOpen={setOpen} index={index} key={index} />
      ))}
    </Stack>
  )
}

export const SignatureCollection = ({ sigs }: { sigs: Signature[] }): JSX.Element => {
  const [pageSize, setPageSize] = useState(10)
  const [page, setPage] = useState(1)

  const [start, end] = useMemo((): [number, number] => {
    const page_ = Math.min(page, Math.floor((sigs.length + pageSize) / pageSize))
    return [(page_ - 1) * pageSize, page_ * pageSize]
  }, [pageSize, page, sigs])

  const actualSigs = useMemo((): Signature[] => sigs.slice(start, end), [sigs, start, end])
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
              count={Math.floor((sigs.length + pageSize) / pageSize)}
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
