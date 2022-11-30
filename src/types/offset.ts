export const prefix = 'https://raw.githubusercontent.com/frk1/hazedumper/master/'
export const configSuffix = 'config.json'
export const offsetsSuffix = 'csgo.json'

export type Signature = {
  name: string
  extra: number
  relative: boolean
  module: string
  offsets: number[]
  pattern: string
}

export type NetVar = {
  name: string
  prop: string
  offset?: number
  table: string
}

export type Config = {
  executable: string
  filename: string
  signatures: Signature[]
  netvars: NetVar[]
}
