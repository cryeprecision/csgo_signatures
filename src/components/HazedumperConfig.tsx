import { Paper, Stack } from '@mui/material'
import { Config, Signature, NetVar } from '../types/hazedumper'
import { MyTextField, MyTypography } from './Base'

const HazedumperConfigSignature = ({ sig }: { sig: Signature }): JSX.Element => {
  return (
    <Paper elevation={4} sx={{ p: 1 }}>
      <MyTextField label='Pattern' value={sig.pattern} />
      <MyTextField label='Module' value={sig.module} />
      <MyTextField label='Name' value={sig.name} />
      {sig.offsets.length !== 0 && <MyTextField label='Offsets' value={sig.offsets.join(', ')} />}
    </Paper>
  )
}

const HazedumperConfigNetVar = ({ netVar }: { netVar: NetVar }): JSX.Element => {
  return (
    <Paper elevation={4} sx={{ p: 1 }}>
      <MyTextField label='Name' value={netVar.name} />
      {netVar.offset && <MyTextField label='Offset' value={netVar.offset} />}
      <MyTextField label='Prop' value={netVar.prop} />
      <MyTextField label='Table' value={netVar.table} />
    </Paper>
  )
}

export const HazedumperConfig = ({ cfg }: { cfg: Config }): JSX.Element => {
  return (
    <Paper elevation={2} sx={{ p: 1 }}>
      <Paper elevation={3} sx={{ p: 1 }}>
        <MyTypography title={cfg.executable} />
      </Paper>
      <Stack>
        <Stack>
          {cfg.netvars.slice(0, 10).map(netVar => (
            <HazedumperConfigNetVar netVar={netVar} key={netVar.name} />
          ))}
        </Stack>
        <Stack>
          {cfg.signatures.slice(0, 10).map(sig => (
            <HazedumperConfigSignature sig={sig} key={sig.name} />
          ))}
        </Stack>
      </Stack>
    </Paper>
  )
}
