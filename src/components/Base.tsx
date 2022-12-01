import { TypographyProps, TextFieldProps, TooltipProps } from '@mui/material'
import { Typography, TextField, Tooltip } from '@mui/material'

export type MyTypographyProps = {
  title: string
} & TypographyProps
export const MyTypography = ({ title, ...props }: MyTypographyProps): JSX.Element => (
  <Typography fontFamily='Roboto Mono' {...props}>
    {title}
  </Typography>
)

export const MyTextField = (props: TextFieldProps): JSX.Element => {
  return <TextField variant='outlined' size='small' disabled inputProps={{ sx: { fontFamily: 'Roboto Mono' } }} {...props} />
}

export type MyTooltipProps = {
  title: string
} & TooltipProps
export const MyTooltip = ({ title, children, ...props }: MyTooltipProps): JSX.Element | null => {
  return children // disable tooltip for now
  return (
    <Tooltip title={<Typography fontFamily='Roboto Mono'>{title}</Typography>} {...props}>
      {children}
    </Tooltip>
  )
}
