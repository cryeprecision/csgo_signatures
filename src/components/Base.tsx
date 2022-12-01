import { Box, IconButton, Paper, Stack } from '@mui/material'
import { Accordion, AccordionDetails, AccordionDetailsProps, AccordionProps, AccordionSummary, AccordionSummaryProps } from '@mui/material'
import { TypographyProps, TextFieldProps, TooltipProps } from '@mui/material'
import { Typography, TextField, Tooltip } from '@mui/material'
import { DataGrid, DataGridProps } from '@mui/x-data-grid'
import { ContentCopy } from '@mui/icons-material'

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

export const MyTextField = ({ value, ...props }: TextFieldProps): JSX.Element => {
  return (
    <Stack direction='row'>
      <IconButton
        sx={{ mr: 1, borderRadius: 1, border: '1px solid rgba(255, 255, 255, 0.2)' }}
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
        {...props}
      />
    </Stack>
  )
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

export const MyAccordion = ({ sx, elevation, ...props }: AccordionProps) => {
  return (
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
}

export const MyAccordionSummary = ({ sx, ...props }: AccordionSummaryProps) => {
  return (
    <AccordionSummary
      sx={{
        padding: 0,
        display: 'block',
        ...sx,
      }}
      {...props}
    />
  )
}

export const MyAccordionDetails = ({ sx, ...props }: AccordionDetailsProps) => {
  return (
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
}

export const MyDataGrid = ({ sx, ...props }: DataGridProps) => {
  return (
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
}
