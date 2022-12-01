export type Resource = {
  readonly name: string
  readonly urlSuffix: string
}

export type FetchCallback = (name: string, index: number) => void

export type ClassInfo = {
  readonly name: string
  readonly nameCompact?: string
  readonly vTableIndex: number
}

export type Signature = {
  readonly fileName: string
  readonly lineNr: number
  readonly sigName: string
  readonly sigNameCompact?: string
  readonly sig: string
  readonly source?: string
  readonly classInfo?: ClassInfo
}
