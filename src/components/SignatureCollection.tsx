import { Theme } from '@emotion/react'
import { Box, Button, Collapse, IconButton, MenuItem, Pagination, Paper, Select, Stack, SxProps, Typography } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import { memo, useEffect, useMemo, useState } from 'react'
import { ClassInfo, Signature } from '../types/types'
import { ExpandMore, ExpandLess } from '@mui/icons-material'
import * as Sig from './Signature'
import { paging } from '../utility/paging'

type SetOpen = React.Dispatch<React.SetStateAction<boolean[]>>

type SignatureItemProps = {
  sig: Signature
  index: number
}

const classInfosAreEqual = (lhs: ClassInfo | undefined, rhs: ClassInfo | undefined): boolean => {
  if (lhs !== undefined && rhs !== undefined) return lhs.nameCompact === rhs.nameCompact
  return (lhs === undefined) === (rhs == undefined)
}

const sigsAreEqual = (lhs: Signature, rhs: Signature): boolean => {
  if (lhs.lineNr !== rhs.lineNr || lhs.fileName !== rhs.fileName || lhs.sigName !== rhs.sigName) return false
  return classInfosAreEqual(lhs.classInfo, rhs.classInfo)
}

const sigPropsAreEqual = (lhs: SignatureItemProps, rhs: SignatureItemProps): boolean => {
  return sigsAreEqual(lhs.sig, rhs.sig)
}

const signatureItemSx: SxProps<Theme> = {
  p: 1,
}

const SignatureItem_ = ({ sig, index }: SignatureItemProps): JSX.Element => {
  return (
    <Button
      sx={{
        display: 'block',
        textTransform: 'none',
        borderColor: 'transparent',
        px: 1,
        m: 0,
        ':hover': {
          backgroundColor: 'transparent',
        },
      }}
      variant='outlined'
    >
      <Paper sx={{ p: 1 }}>
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
    </Button>
  )
}
const SignatureItem = memo(SignatureItem_, sigPropsAreEqual)

const pageSizes: number[] = [5, 10, 25, 50, 100]

const ActualCollection = ({ sigs }: { sigs: Signature[] }): JSX.Element => {
  return (
    <Stack sx={{ my: 1 }} gap={0}>
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
