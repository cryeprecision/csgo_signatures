import * as Fetch from './fetch'

export const prefix = 'https://raw.githubusercontent.com/frk1/hazedumper/master/'
export const configSuffix = 'config.json'
export const offsetsSuffix = 'csgo.json'

export type Signature = {
  readonly name: string
  readonly extra: number
  readonly relative: boolean
  readonly module: string
  readonly offsets: number[]
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

export type Offsets = {
  timestamp: number
  signatures: Record<string, number>
  netvars: Record<string, number>
}

export const loadConfig = (signal?: AbortSignal): Promise<Config> => {
  return Fetch.fetchOneJson(prefix + configSuffix, signal)
}
export const loadOffsets = (signal?: AbortSignal): Promise<Offsets> => {
  return Fetch.fetchOneJson(prefix + offsetsSuffix, signal)
}
