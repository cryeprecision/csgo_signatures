import { Theme } from '@emotion/react'
import { Accordion, AccordionDetails, AccordionSummary, Box, Chip as Chip_, Paper, Stack, Typography } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { memo, useMemo } from 'react'
import { ResourceMap, Signature, ClassInfo } from '../types/types'

type DataSignature = {
  file: string
  name: string
  sig: string
  source: string
  className: string
  vTableIndex: string
}

const columns: GridColDef[] = [
  {
    field: 'name',
    headerName: 'Name',
    sortable: true,
    filterable: true,
    flex: 9,
  },
  {
    field: 'sig',
    headerName: 'Signature',
    sortable: true,
    filterable: true,
    flex: 9,
  },
  {
    field: 'file',
    headerName: 'File',
    sortable: true,
    filterable: true,
    flex: 1,
  },
  {
    field: 'source',
    headerName: 'Source',
    sortable: true,
    filterable: true,
    flex: 1,
  },
  {
    field: 'className',
    headerName: 'Class-Name',
    sortable: true,
    filterable: true,
    flex: 3,
  },
  {
    field: 'vTableIndex',
    headerName: 'V-Table-Index',
    sortable: true,
    filterable: true,
    flex: 1,
  },
]

const buildData = (map: ResourceMap): DataSignature[] => {
  let buffer: DataSignature[] = []
  for (const [name, sigs] of Object.entries(map)) {
    buffer.push(
      ...sigs.map(sig => ({
        file: name,
        name: sig.name,
        sig: sig.sig,
        source: sig.source ?? '',
        className: sig.classInfo ? sig.classInfo.name : '',
        vTableIndex: sig.classInfo ? sig.classInfo.vTableIndex.toString() : '',
      })),
    )
  }
  return buffer
}

const getId = (sig: DataSignature): string => sig.file + sig.name

export type SignatureItemProps = {
  file: string
  sig: Signature
}

const SignatureItem_ = ({ sig, file }: SignatureItemProps): JSX.Element => {
  return (
    <Accordion>
      <AccordionSummary>
        <Typography fontFamily='Roboto Mono'>{sig.name}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Box>
          <Typography fontFamily='Roboto Mono' align='left' noWrap fontSize={10}>
            {`${file}.dll -> ${sig.sig}`}
          </Typography>
          {sig.classInfo && <Typography fontFamily='Roboto Mono'>{`${sig.classInfo.name}[${sig.classInfo.vTableIndex}]`}</Typography>}
          {sig.source && <Typography fontFamily='Roboto Mono'>{sig.source}</Typography>}
        </Box>
      </AccordionDetails>
    </Accordion>
  )
}

const SignatureItem = memo(SignatureItem_)

export type SignatureCollectionProps = {
  sigs: ResourceMap
}

const SignatureCollection_ = ({ sigs }: SignatureCollectionProps): JSX.Element => {
  const dataSigs = useMemo((): DataSignature[] => buildData(sigs), [sigs])
  return (
    <Paper elevation={2} sx={{ height: '80vh' }}>
      <DataGrid columns={columns} rows={dataSigs} getRowId={getId} />
    </Paper>
  )
}

export const SignatureCollection = memo(SignatureCollection_)
