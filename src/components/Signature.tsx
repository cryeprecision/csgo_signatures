import { Box, SxProps, Theme } from '@mui/material'
import { Signature } from '../types/kittenpopo'
import { MyTooltip, MyTypography } from './Base'

const baseSx: SxProps<Theme> = {
  borderRadius: 1,
  border: '1px solid rgba(255, 255, 255, 0.2)',
  p: 1,
}

const nameSx: SxProps<Theme> = {
  ...baseSx,
}
export const MySignatureName = ({ sig }: { sig: Signature }): JSX.Element => {
  const text = sig.sigNameShort ?? sig.sigName
  return (
    <MyTooltip title={text}>
      <MyTypography sx={nameSx} title={text} />
    </MyTooltip>
  )
}

const sigSx: SxProps<Theme> = {
  ...baseSx,
  color: theme => theme.palette.info[theme.palette.mode],
}
export const MySignature = ({ sig }: { sig: Signature }): JSX.Element => {
  const text = sig.sig
  return (
    <MyTooltip title={text}>
      <MyTypography sx={sigSx} title={text} />
    </MyTooltip>
  )
}

const fileNameSx: SxProps<Theme> = {
  ...baseSx,
  color: theme => theme.palette.error[theme.palette.mode],
}
export const MyFileName = ({ sig }: { sig: Signature }): JSX.Element => {
  const text = sig.fileName + '.dll'
  return (
    <MyTooltip title={text}>
      <MyTypography sx={fileNameSx} title={text} />
    </MyTooltip>
  )
}

const classInfoSx: SxProps<Theme> = {
  ...baseSx,
  color: theme => theme.palette.warning[theme.palette.mode],
}
export const MyClassInfo = ({ sig }: { sig: Signature }): JSX.Element | null => {
  if (sig.classInfo === undefined) return null
  const text = `${sig.classInfo.nameShort ?? sig.classInfo.name}[${sig.classInfo.vTableIndex}]`
  return (
    <Box>
      <MyTooltip title={text}>
        <MyTypography sx={classInfoSx} title={text} />
      </MyTooltip>
    </Box>
  )
}

const sourceSx: SxProps<Theme> = {
  ...baseSx,
  color: theme => theme.palette.success[theme.palette.mode],
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
