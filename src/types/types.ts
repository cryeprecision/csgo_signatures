export type Resource = {
  name: string
  urlSuffix: string
}

export type FetchCallback = (name: string, index: number) => void

export type ClassInfo = {
  name: string
  vTableIndex: number
}

export type Signature = {
  name: string
  sig: string
  source?: string
  classInfo?: ClassInfo
}

export type FileSignature = {
  file: string
  name: string
  sig: string
  source?: string
  classInfo?: ClassInfo
}

export type RawResourceMap = { [key: string]: string }
export type ResourceMap = { [key: string]: Signature[] }

export const toFileSignatures = (map: ResourceMap): FileSignature[] => {
  let buffer: FileSignature[] = []
  for (const [name, sigs] of Object.entries(map)) {
    buffer.push(
      ...sigs.map(sig => ({
        file: name,
        name: sig.name,
        sig: sig.sig,
        source: sig.source,
        classInfo: sig.classInfo,
      })),
    )
  }
  return buffer
}
