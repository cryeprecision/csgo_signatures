import { Theme } from '@emotion/react'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  MenuItem,
  Pagination,
  Paper,
  Select,
  Stack,
  styled,
  Typography,
} from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import { memo, useMemo, useState } from 'react'
import { Signature } from '../types/types'
import { paging } from '../utility/paging'

export const MySignatureName = ({ sig }: { sig: Signature }): JSX.Element => {
  return (
    <Typography
      fontFamily='Roboto Mono'
      sx={{ color: theme => theme.palette.info.dark, backgroundColor: theme => theme.palette.background.paper }}
    >
      {sig.sigName}
    </Typography>
  )
}
export const MySignature = ({ sig }: { sig: Signature }): JSX.Element => {
  return (
    <Typography
      fontFamily='Roboto Mono'
      sx={{ color: theme => theme.palette.info.dark, backgroundColor: theme => theme.palette.background.paper }}
    >
      {sig.sig}
    </Typography>
  )
}
export const MyFileName = ({ sig }: { sig: Signature }): JSX.Element => {
  return (
    <Typography
      fontFamily='Roboto Mono'
      sx={{ color: theme => theme.palette.error.dark, backgroundColor: theme => theme.palette.background.paper }}
    >
      {sig.fileName + '.dll'}
    </Typography>
  )
}
export const MyClassInfo = ({ sig }: { sig: Signature }): JSX.Element | null => {
  if (sig.classInfo === undefined) return null
  return (
    <Typography
      fontFamily='Roboto Mono'
      sx={{ color: theme => theme.palette.warning.dark, backgroundColor: theme => theme.palette.background.paper }}
    >{`${sig.classInfo.name}[${sig.classInfo.vTableIndex}]`}</Typography>
  )
}
export const MySource = ({ sig }: { sig: Signature }): JSX.Element | null => {
  if (sig.source === undefined) return null
  return (
    <Typography
      fontFamily='Roboto Mono'
      sx={{ color: theme => theme.palette.success.dark, backgroundColor: theme => theme.palette.background.paper }}
    >
      {sig.source}
    </Typography>
  )
}
