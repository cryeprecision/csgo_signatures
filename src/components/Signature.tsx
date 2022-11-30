import { Box, SxProps, TextField, TextFieldProps, Theme, Tooltip, Typography } from '@mui/material'
import { Signature } from '../types/types'

const baseSx: SxProps<Theme> = {
  borderRadius: 1,
  border: '1px solid rgba(255, 255, 255, 0.2)',
  p: 1,
}
const nameSx: SxProps<Theme> = {
  ...baseSx,
}
const sigSx: SxProps<Theme> = {
  ...baseSx,
  color: theme => theme.palette.info[theme.palette.mode],
}
const fileNameSx: SxProps<Theme> = {
  ...baseSx,
  color: theme => theme.palette.error[theme.palette.mode],
}
const classInfoSx: SxProps<Theme> = {
  ...baseSx,
  color: theme => theme.palette.warning[theme.palette.mode],
}
const sourceSx: SxProps<Theme> = {
  ...baseSx,
  color: theme => theme.palette.success[theme.palette.mode],
}

export const MyTypography = ({ sx, title, noWrap }: { sx?: SxProps<Theme>; title: string; noWrap?: boolean }): JSX.Element => {
  return (
    <Typography noWrap={noWrap ?? true} fontFamily='Roboto Mono' sx={sx}>
      {title}
    </Typography>
  )
}

export const MyTextField = (props: TextFieldProps): JSX.Element => {
  return <TextField {...props} variant='outlined' size='small' disabled inputProps={{ sx: { fontFamily: 'Roboto Mono' } }} />
}

const MyTooltip = ({ title, children }: { title: string; children: JSX.Element }): JSX.Element | null => {
  return children // disable tooltip for now
  return <Tooltip title={<Typography fontFamily='Roboto Mono'>{title}</Typography>}>{children}</Tooltip>
}

export const MySignatureName = ({ sig }: { sig: Signature }): JSX.Element => {
  const text = sig.sigNameCompact ?? sig.sigName
  return (
    <MyTooltip title={text}>
      <MyTypography sx={nameSx} title={text} />
    </MyTooltip>
  )
}
export const MySignature = ({ sig }: { sig: Signature }): JSX.Element => {
  const text = sig.sig
  return (
    <MyTooltip title={text}>
      <MyTypography sx={sigSx} title={text} />
    </MyTooltip>
  )
}
export const MyFileName = ({ sig }: { sig: Signature }): JSX.Element => {
  const text = sig.fileName + '.dll'
  return (
    <MyTooltip title={text}>
      <MyTypography sx={fileNameSx} title={text} />
    </MyTooltip>
  )
}
export const MyClassInfo = ({ sig }: { sig: Signature }): JSX.Element | null => {
  if (sig.classInfo === undefined) return null
  const text = `${sig.classInfo.nameCompact ?? sig.classInfo.name}[${sig.classInfo.vTableIndex}]`
  return (
    <Box>
      <MyTooltip title={text}>
        <MyTypography sx={classInfoSx} title={text} />
      </MyTooltip>
    </Box>
  )
}
export const MySource = ({ sig }: { sig: Signature }): JSX.Element | null => {
  if (sig.source === undefined) return null
  const text = sig.source
  return (
    <MyTooltip title={text}>
      <MyTypography sx={sourceSx} title={text} />
    </MyTooltip>
  )
}
