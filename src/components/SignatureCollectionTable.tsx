import styled from '@emotion/styled'
import { Paper } from '@mui/material'
import { DataGrid, GridColDef, DataGridProps } from '@mui/x-data-grid'
import { memo, useMemo } from 'react'
import { Signature } from '../types/types'

type DataSignature = {
  file: string
  name: string
  sig: string
  source: string
  className: string
  vTableIndex: string
}

const StyledDataGrid = styled((props: DataGridProps) => <DataGrid {...props} />)(() => ({
  '& .MuiDataGrid-iconSeparator': {
    display: 'none',
  },
}))

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

const buildData = (sigs: Signature[]): DataSignature[] => {
  return sigs.map(sig => ({
    file: sig.fileName,
    name: sig.sigName,
    sig: sig.sig,
    source: sig.source ?? '',
    className: sig.classInfo ? sig.classInfo.name : '',
    vTableIndex: sig.classInfo ? sig.classInfo.vTableIndex.toString() : '',
  }))
}

const getId = (sig: DataSignature): string => sig.file + sig.name

const SignatureCollection_ = ({ sigs }: { sigs: Signature[] }): JSX.Element => {
  const dataSigs = useMemo((): DataSignature[] => buildData(sigs), [sigs])
  return (
    <Paper elevation={2} sx={{ height: '60vh', m: 2 }}>
      <StyledDataGrid columns={columns} rows={dataSigs} getRowId={getId} />
    </Paper>
  )
}

export const SignatureCollection = memo(SignatureCollection_)
