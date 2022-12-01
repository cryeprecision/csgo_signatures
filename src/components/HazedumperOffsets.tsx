import { Paper, Stack } from '@mui/material'
import { Offsets } from '../types/hazedumper'
import { MyTextField, MyTypography } from './Base'

const HazedumperOffset = ({ name, offset }: { name: string; offset: number }): JSX.Element => {
  return (
    <Paper elevation={4} sx={{ p: 1 }}>
      <MyTextField label={name} value={'0x' + offset.toString(16).toUpperCase().padStart(8, '0')} />
    </Paper>
  )
}

export const HazedumperOffsets = ({ offsets }: { offsets: Offsets }): JSX.Element => {
  return (
    <Paper elevation={2} sx={{ p: 1 }}>
      <Paper elevation={3} sx={{ p: 1 }}>
        <MyTypography title={new Date(offsets.timestamp * 1000).toLocaleString()} />
      </Paper>
      <Stack gap={1}>
        {Object.entries(offsets.signatures)
          .slice(0, 10)
          .map(([name, offset]) => (
            <HazedumperOffset name={name} offset={offset} key={name} />
          ))}
        {Object.entries(offsets.netvars)
          .slice(0, 10)
          .map(([name, offset]) => (
            <HazedumperOffset name={name} offset={offset} key={name} />
          ))}
      </Stack>
    </Paper>
  )
}
