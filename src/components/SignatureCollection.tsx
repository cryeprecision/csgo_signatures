import { Box, IconButton, Paper, Stack, Theme, useMediaQuery } from '@mui/material'
import { memo, useEffect, useState } from 'react'
import { ContentCopy } from '@mui/icons-material'

import { paging } from '../types/paging'
import { ClassInfo, Signature } from '../types/types'
import { Paging } from './Paging'
import { MyAccordion, MyAccordionSummary, MyAccordionDetails, MyTextField, MyTypography } from './Base'
import { MySignatureName, MySource, MyFileName, MySignature, MyClassInfo } from './Signature'

type SetOpen = React.Dispatch<React.SetStateAction<number>>

type SignatureItemProps = {
  sig: Signature
  index: number
  open: boolean
  setOpen: SetOpen
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
  return lhs.open === rhs.open && sigsAreEqual(lhs.sig, rhs.sig)
}

const SignatureItem_ = ({ sig, index, open, setOpen }: SignatureItemProps): JSX.Element => {
  return (
    <MyAccordion elevation={3} expanded={open} onChange={(_event, newOpen) => setOpen(newOpen ? index : -1)}>
      <MyAccordionSummary>
        <Box sx={{ p: 0, width: '100%' }}>
          <Box sx={{ display: 'flex', mb: 1, justifyContent: 'space-between', columnGap: 1 }}>
            <MySignatureName sig={sig} />
            <Box sx={{ display: 'flex', columnGap: 1 }}>
              <MySource sig={sig} />
              <MyFileName sig={sig} />
            </Box>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', columnGap: 1 }}>
            <MySignature sig={sig} />
            <MyClassInfo sig={sig} />
          </Box>
        </Box>
      </MyAccordionSummary>
      <MyAccordionDetails>
        <MyModal sig={sig} />
      </MyAccordionDetails>
    </MyAccordion>
  )
}
const SignatureItem = memo(SignatureItem_, sigPropsAreEqual)

const pageSizes: number[] = [5, 10, 25, 50, 100]

const ActualCollection = ({ sigs, open, setOpen }: { sigs: Signature[]; open: number; setOpen: SetOpen }): JSX.Element => {
  return (
    <Stack sx={{ my: 1 }} gap={1}>
      {sigs.map((sig, index) => (
        <SignatureItem sig={sig} index={index} key={index} setOpen={setOpen} open={index === open} />
      ))}
    </Stack>
  )
}

const MyInfoElement = ({ value, title }: { value: string; title?: string }): JSX.Element => {
  const onClick = () =>
    navigator.clipboard
      .writeText(value)
      .then(() => alert('Copied to clipboard'))
      .catch(err => alert("Couldn't copy to clipboard\n" + err))

  return (
    <Box display='flex'>
      <IconButton sx={{ mr: 1, borderRadius: 1, border: '1px solid rgba(255, 255, 255, 0.2)' }} onClick={onClick}>
        <ContentCopy />
      </IconButton>
      <MyTextField value={value} label={title} fullWidth />
    </Box>
  )
}

const MyModalInfo = ({ title, value }: { title: string; value: string }): JSX.Element => {
  return (
    <Stack gap={0.5}>
      <MyInfoElement value={value} title={title} />
    </Stack>
  )
}

const MyModal = ({ sig }: { sig: Signature | null }): JSX.Element | null => {
  if (sig === null) return null
  return (
    <Box sx={{ mt: 2 }}>
      <Stack gap={1}>
        <MyModalInfo title='Function:' value={sig.sigName} />
        <MyModalInfo title='Signature:' value={`${sig.fileName}.dll -> ${sig.sig}`} />
        {sig.classInfo && <MyModalInfo title='Class:' value={sig.classInfo.name} />}
        {sig.classInfo && <MyModalInfo title='Virtual-Function-Table-Index:' value={sig.classInfo.vTableIndex.toString()} />}
        {sig.source && <MyModalInfo title='Source:' value={sig.source} />}
      </Stack>
    </Box>
  )
}

export const SignatureCollection = ({ sigs }: { sigs: Signature[] }): JSX.Element => {
  const [pageSize, setPageSize] = useState(10)
  const [page, setPage] = useState(1)
  const [open, setOpen] = useState(-1)

  useEffect(() => setOpen(-1), [sigs, page])

  const { pages, start, end } = paging(sigs.length, pageSize, page)
  const reduced = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'))

  return (
    <Box sx={{ mx: { xs: 1, md: 2, lg: 8, xl: 32 } }}>
      <MyAccordion>
        <MyAccordionSummary>
          <Paper elevation={3} sx={{ p: 1, width: '100%' }}>
            <MyTypography title='Kittenpopo Signatures' />
          </Paper>
        </MyAccordionSummary>
        <MyAccordionDetails>
          <Paper elevation={3}>
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
          <ActualCollection sigs={sigs.slice(start, end)} setOpen={setOpen} open={open} />
        </MyAccordionDetails>
      </MyAccordion>
    </Box>
  )
}
