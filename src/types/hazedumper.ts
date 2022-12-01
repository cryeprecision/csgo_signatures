import * as Fetch from './fetch'

export const prefix = 'https://raw.githubusercontent.com/frk1/hazedumper/master/'
export const configSuffix = 'config.json'
export const offsetsSuffix = 'csgo.json'

export type Signature = {
  readonly name: string
  readonly extra: number
  readonly relative: boolean
  readonly module: string
  readonly offsets?: number[]
  readonly pattern: string
}

export type NetVar = {
  readonly name: string
  readonly prop: string
  readonly offset?: number
  readonly table: string
}

export type Config = {
  readonly executable: string
  readonly filename: string
  readonly signatures: Signature[]
  readonly netvars: NetVar[]
}

export type Offset = {
  readonly name: string
  readonly offset: number
  readonly type: 'signature' | 'netvar'
}

export type Offsets = {
  readonly timestamp: number
  readonly offsets: Offset[]
}

export const loadConfig = (signal?: AbortSignal): Promise<Config> => {
  return Fetch.fetchOneJson<Config>(prefix + configSuffix, signal)
}
export const loadOffsets = async (signal?: AbortSignal): Promise<Offsets> => {
  type JsonType = { timestamp: number; signatures: Record<string, number>; netvars: Record<string, number> }
  const json = await Fetch.fetchOneJson<JsonType>(prefix + offsetsSuffix, signal)

  const netvars = Object.entries(json.netvars).map(([name, offset]): Offset => ({ name: name, offset: offset, type: 'netvar' }))
  const sigs = Object.entries(json.signatures).map(([name, offset]): Offset => ({ name: name, offset: offset, type: 'signature' }))

  return {
    timestamp: json.timestamp,
    offsets: netvars.concat(sigs),
  }
}
