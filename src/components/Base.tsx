import { alpha, getOverlayAlpha, lighten, SxProps, Theme } from '@mui/material'
import { IconButton, Paper, Stack } from '@mui/material'
import { Accordion, AccordionDetails, AccordionDetailsProps, AccordionProps, AccordionSummary, AccordionSummaryProps } from '@mui/material'
import { TypographyProps, TextFieldProps, TooltipProps } from '@mui/material'
import { Typography, TextField, Tooltip } from '@mui/material'
import { DataGrid, DataGridProps } from '@mui/x-data-grid'
import { ContentCopy } from '@mui/icons-material'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const paperBackground = (elevation: number): string => {
  const color = alpha('#fff', parseFloat(getOverlayAlpha(elevation)))
  return `linear-gradient(${color}, ${color})`
}

export type MyTypographyProps = {
  title: string
} & TypographyProps
export const MyTypography = ({ title, sx, ...props }: MyTypographyProps): JSX.Element => (
  <Typography fontFamily='Roboto Mono' noWrap sx={{ ...sx }} {...props}>
    {title}
  </Typography>
)

const copyToClipboard = (text: string) =>
  navigator.clipboard
    .writeText(text)
    .then(() => alert('Copied to clipboard'))
    .catch(err => alert("Couldn't copy to clipboard\n" + err))

export type MyAccordionTitleProps = {
  children?: React.ReactNode
  sx?: SxProps<Theme>
  elevation?: number
}
export const MyAccordionTitle = ({ elevation, children, sx }: MyAccordionTitleProps): JSX.Element => (
  <Paper
    elevation={elevation}
    sx={theme => ({
      p: 1,
      width: '100%',
      transition: theme.transitions.create(['background-color'], {
        duration: theme.transitions.duration.short,
      }),
      ':hover': {
        backgroundColor: lighten(theme.palette.background.paper, 0.03),
      },
      ...sx,
    })}
  >
    {children}
  </Paper>
)

export const MyTextField = ({ value, sx, fullWidth, ...props }: TextFieldProps): JSX.Element => (
  <Stack direction='row' sx={{ width: fullWidth ? '100%' : undefined, ...sx }}>
    <IconButton
      sx={{
        mr: 1,
        borderRadius: 1,
        border: '1px solid rgba(255, 255, 255, 0.3)',
        ':disabled': {
          borderColor: 'rgba(255, 255, 255, 0.05)',
        },
        ':hover': {
          borderColor: 'rgba(255, 255, 255, 0.5)',
        },
      }}
      disabled={`${value}`.length === 0}
      onClick={() => copyToClipboard(`${value}`)}
    >
      <ContentCopy />
    </IconButton>
    <TextField
      variant='outlined'
      size='small'
      focused
      disabled
      inputProps={{ sx: { fontFamily: 'Roboto Mono' } }}
      InputLabelProps={{ shrink: true }}
      value={value}
      fullWidth={fullWidth}
      sx={{ '& .MuiOutlinedInput-root': { height: '100%' } }}
      {...props}
    />
  </Stack>
)

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

export const MyAccordion = ({ sx, elevation, ...props }: AccordionProps) => (
  <Paper sx={{ p: 1 }} elevation={elevation ?? 1}>
    <Accordion
      disableGutters={true}
      TransitionProps={{ unmountOnExit: true }}
      elevation={0}
      sx={{
        border: 'none',
        backgroundColor: 'transparent',
        ':before': { display: 'none' },
        '& .MuiAccordionSummary-content': { margin: 0, padding: 0 },
        '& .MuiAccordionSummary-root': { minHeight: 0 },
        ...sx,
      }}
      {...props}
    ></Accordion>
  </Paper>
)

export const MyAccordionSummary = ({ sx, ...props }: AccordionSummaryProps) => (
  <AccordionSummary
    sx={{
      padding: 0,
      ...sx,
    }}
    {...props}
  />
)

export const MyAccordionDetails = ({ sx, ...props }: AccordionDetailsProps) => (
  <AccordionDetails
    sx={{
      padding: 0,
      marginTop: 1,
      display: 'block',
      ...sx,
    }}
    {...props}
  />
)

export const MyDataGrid = ({ sx, ...props }: DataGridProps) => (
  <DataGrid
    sx={{
      '& .MuiDataGrid-iconSeparator': {
        display: 'none',
      },
      ...sx,
    }}
    {...props}
  />
)
