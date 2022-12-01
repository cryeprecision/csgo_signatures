import { Box, MenuItem, Pagination, Select } from '@mui/material'

export type PagingProps = {
  size?: 'small' | 'large' | 'medium'
  pages: number
  pageSizes: number[]
  pageSize: number
  reduced?: boolean
  setPageSize: React.Dispatch<React.SetStateAction<number>>
  setPage: React.Dispatch<React.SetStateAction<number>>
}

export const Paging = (props: PagingProps): JSX.Element => {
  return (
    <Box display='flex' justifyContent='space-between' alignItems='center' sx={{ p: 1 }}>
      <Box sx={{ p: 1 }}>
        <Pagination
          size={props.size}
          count={props.pages}
          showFirstButton={!(props.reduced ?? false)}
          showLastButton={!(props.reduced ?? false)}
          siblingCount={props.reduced ? 0 : 1}
          onChange={(_event, page) => props.setPage(page)}
        />
      </Box>
      <Box display={props.reduced ? 'none' : undefined}>
        <Select value={props.pageSize} sx={{ minWidth: 100 }} onChange={({ target }) => props.setPageSize(target.value as number)}>
          {props.pageSizes.map(size => (
            <MenuItem key={size} value={size}>
              {size.toString()}
            </MenuItem>
          ))}
        </Select>
      </Box>
    </Box>
  )
}
