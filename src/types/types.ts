export type Resource = {
  name: string
  urlSuffix: string
}

export type FetchCallback = (name: string, index: number) => void

export type ClassInfo = {
  name: string
  nameCompact?: string
  vTableIndex: number
}

export type Signature = {
  fileName: string
  lineNr: number
  sigName: string
  sigNameCompact?: string
  sig: string
  source?: string
  classInfo?: ClassInfo
}

export type RawResourceMap = { [key: string]: string }
