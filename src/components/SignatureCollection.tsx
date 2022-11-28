import { Theme } from '@emotion/react'
import { Box, Collapse, IconButton, MenuItem, Pagination, Paper, Select, Stack, SxProps, Typography } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import { memo, useEffect, useMemo, useState } from 'react'
import { Signature } from '../types/types'
import { ExpandMore, ExpandLess } from '@mui/icons-material'
import * as Sig from './Signature'
import { paging } from '../utility/paging'

type SetOpen = React.Dispatch<React.SetStateAction<boolean[]>>

type SignatureItemProps = {
  sig: Signature
  index: number
}

const arraysAreEqual = (lhs: { sigs: Signature[] }, rhs: { sigs: Signature[] }): boolean => {
  if (lhs.sigs.length !== rhs.sigs.length) return false
  for (let i = 0; i < lhs.sigs.length; i += 1) {
    if (lhs.sigs[i].lineNr !== rhs.sigs[i].lineNr || lhs.sigs[i].fileName !== rhs.sigs[i].fileName) return false
  }
  return true
}
const sigsAreEqual = (lhs: SignatureItemProps, rhs: SignatureItemProps): boolean => {
  return lhs.sig.lineNr === rhs.sig.lineNr && lhs.sig.fileName == rhs.sig.fileName
}

const signatureItemSx: SxProps<Theme> = {
  p: 1,
}

const SignatureItem_ = ({ sig, index }: SignatureItemProps): JSX.Element => {
  return (
    <Paper elevation={2} sx={signatureItemSx}>
      <Box sx={{ display: 'flex', mb: 1, justifyContent: 'space-between', columnGap: 1 }}>
        <Sig.MySignatureName sig={sig} />
        <Box sx={{ display: 'flex', columnGap: 1 }}>
          <Sig.MySource sig={sig} />
          <Sig.MyFileName sig={sig} />
        </Box>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', columnGap: 1 }}>
        <Sig.MySignature sig={sig} />
        <Sig.MyClassInfo sig={sig} />
      </Box>
    </Paper>
  )
}
const SignatureItem = memo(SignatureItem_, sigsAreEqual)

const pageSizes: number[] = [5, 10, 25, 50, 100]

const ActualCollection = ({ sigs }: { sigs: Signature[] }): JSX.Element => {
  return (
    <Stack sx={{ my: 1 }} gap={1}>
      {sigs.map((sig, index) => (
        <SignatureItem sig={sig} index={index} key={index} />
      ))}
    </Stack>
  )
}

export const SignatureCollection = ({ sigs }: { sigs: Signature[] }): JSX.Element => {
  const [pageSize, setPageSize] = useState(10)
  const [page, setPage] = useState(1)

  const { pages, start, end } = paging(sigs.length, pageSize, page)

  return (
    <Box sx={{ px: 2 }}>
      <Paper elevation={2}>
        <Box display='flex' justifyContent='space-between' alignItems='center' sx={{ p: 1 }}>
          <Box sx={{ p: 1 }}>
            <Pagination size='large' count={pages} showFirstButton showLastButton onChange={(_event, page) => setPage(page)} />
          </Box>
          <Box>
            <Select value={pageSize} sx={{ minWidth: 100 }} onChange={({ target }) => setPageSize(target.value as number)}>
              {pageSizes.map(size => (
                <MenuItem key={size} value={size}>
                  {size.toString()}
                </MenuItem>
              ))}
            </Select>
          </Box>
        </Box>
      </Paper>
      <ActualCollection sigs={sigs.slice(start, end)} />
    </Box>
  )
}
