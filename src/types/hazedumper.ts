import { compareStrings } from './compare'
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

export const matchesSearchOffset = (offset: Offset, search: string): boolean => {
  if (search === '') return true
  return offset.name.toLowerCase().includes(search)
}

export const matchesSearchNetVar = (netVar: NetVar, search: string): boolean => {
  if (search === '') return true
  return (
    netVar.name.toLowerCase().includes(search) || netVar.prop.toLowerCase().includes(search) || netVar.table.toLowerCase().includes(search)
  )
}

export const matchesSearchSignature = (sig: Signature, search: string): boolean => {
  if (search === '') return true
  return sig.name.toLowerCase().includes(search) || sig.module.toLowerCase().includes(search)
}

export const loadConfig = async (signal?: AbortSignal): Promise<Config> => {
  const result = await Fetch.fetchOneJson<Config>(prefix + configSuffix, signal)
  result.netvars.sort((lhs, rhs) => {
    const cmp = compareStrings(lhs.table, rhs.table)
    return cmp !== 0 ? cmp : compareStrings(lhs.name, rhs.name)
  })
  result.signatures.sort((lhs, rhs) => {
    const cmp = compareStrings(lhs.module, rhs.module)
    return cmp !== 0 ? cmp : compareStrings(lhs.name, rhs.name)
  })
  return result
}

export const loadOffsets = async (signal?: AbortSignal): Promise<Offsets> => {
  type JsonType = { timestamp: number; signatures: Record<string, number>; netvars: Record<string, number> }
  const json = await Fetch.fetchOneJson<JsonType>(prefix + offsetsSuffix, signal)

  const netvars = Object.entries(json.netvars).map(([name, offset]): Offset => ({ name: name, offset: offset, type: 'netvar' }))
  const sigs = Object.entries(json.signatures).map(([name, offset]): Offset => ({ name: name, offset: offset, type: 'signature' }))
  const all = netvars.concat(sigs)
  all.sort((lhs, rhs) => compareStrings(lhs.name, rhs.name))

  return {
    timestamp: json.timestamp,
    offsets: all,
  }
}
