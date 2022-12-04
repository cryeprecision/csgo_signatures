import { AppBar as AppBar_, Chip as Chip_ } from '@mui/material'
import { IconButton, Toolbar, Typography, Box, TextField, InputAdornment } from '@mui/material'
import { SxProps, useMediaQuery, Theme } from '@mui/material'
import { Menu, Search, AccountCircle } from '@mui/icons-material'

export type AppBarProps = {
  appState: string
  setSearch?: React.Dispatch<React.SetStateAction<string>>
}

const Chip = ({ sx, label }: { sx?: SxProps<Theme>; label?: React.ReactNode }): JSX.Element => {
  return <Chip_ sx={{ ml: 1, ...sx }} label={label} />
}

export const AppBar = ({ appState, setSearch }: AppBarProps): JSX.Element => {
  const reduced = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'))
  const optional = reduced ? 'none' : undefined

  return (
    <AppBar_ position='sticky' sx={{ mb: 1 }}>
      <Toolbar>
        <IconButton size='large' edge='start' sx={{ mr: 2, display: optional }}>
          <Menu />
        </IconButton>
        <Typography variant='h6' noWrap display={optional}>
          CS:GO Signatures
        </Typography>
        <TextField
          variant='outlined'
          sx={{ m: 2 }}
          size='small'
          fullWidth={reduced}
          onChange={({ target }) => setSearch?.(target.value)}
          placeholder='Search'
          InputProps={{
            startAdornment: (
              <InputAdornment position='start'>
                <Search />
              </InputAdornment>
            ),
          }}
        ></TextField>

        <Box sx={{ flexGrow: 1 }} />

        <Chip sx={{ display: optional }} label={appState} />
        <IconButton size='large' edge='end' sx={{ ml: 2, display: optional }}>
          <AccountCircle />
        </IconButton>
      </Toolbar>
    </AppBar_>
  )
}
