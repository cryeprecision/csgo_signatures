import { AppBar as AppBar_, IconButton, Toolbar, Typography, Box, TextField, Chip as Chip_, SxProps, InputAdornment } from '@mui/material'
import { Menu, Search, AccountCircle } from '@mui/icons-material'
import styled from '@emotion/styled'
import { Theme } from '@emotion/react'

export type AppBarProps = {
  appState: string
  sigsLoaded?: number
  sigsMatched?: number
  setSearch?: React.Dispatch<React.SetStateAction<string>>
}

const Chip = ({ sx, label }: { sx?: SxProps<Theme>; label?: React.ReactNode }): JSX.Element => {
  return <Chip_ sx={{ ml: 1, ...sx }} label={label} />
}

export const AppBar = ({ appState, sigsLoaded, sigsMatched, setSearch }: AppBarProps): JSX.Element => {
  return (
    <AppBar_ position='sticky' sx={{ mb: 2 }}>
      <Toolbar>
        <IconButton size='large' edge='start' sx={{ mr: 2 }}>
          <Menu />
        </IconButton>
        <Typography variant='h6' noWrap>
          CS:GO Signatures
        </Typography>
        <TextField
          variant='outlined'
          sx={{ m: 2 }}
          size='small'
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

        {sigsLoaded && <Chip label={`${sigsMatched ?? 0}/${sigsLoaded}`} />}
        <Chip label={appState} />
        <IconButton size='large' edge='end' sx={{ ml: 2 }}>
          <AccountCircle />
        </IconButton>
      </Toolbar>
    </AppBar_>
  )
}
