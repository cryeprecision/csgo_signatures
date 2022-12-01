import * as Fetch from './fetch'
import { omitBrackets } from './omit_brackets'

const url = 'https://raw.githubusercontent.com/KittenPopo/csgo-offsets/master/function_signatures.h'

export type Signature = {
  readonly fileName: string
  readonly lineNr: number
  readonly sigName: string
  readonly sigNameShort?: string
  readonly sig: string
}

const omitLongTemplates = (text: string): string | null => {
  return omitBrackets(text, ['<', '>'], 1, '[...]', 10)
}

const shortenSigName = (name: string): string | undefined => {
  let omitted = name

  // remove `virtual ` prefixes
  if (omitted.startsWith('virtual ')) {
    omitted = omitted.substring(8)
  }

  // remove templates that are just wrong
  const start = omitted.indexOf('<')
  if (start !== -1 && omitted.indexOf('>') === -1) {
    omitted = omitted.substring(0, start)
  }

  omitted = omitLongTemplates(omitted) ?? 'INVALID'

  return omitted === name ? undefined : omitted
}

const parseLine = (fileName: string, line: string, lineNr: number): Signature | null => {
  const delim = line.indexOf('=')
  if (delim === -1 || line.indexOf('=', delim + 1) !== -1) return null

  const sigName = line.substring(0, delim).trim()
  const sigNameShort = shortenSigName(sigName)

  const sigStart = line.indexOf('"')
  if (sigStart === -1) return null
  const sigEnd = line.indexOf('"', sigStart + 1)
  if (sigEnd === -1) return null

  const sig = line.substring(sigStart + 1, sigEnd).trim()

  return {
    fileName: fileName,
    lineNr: lineNr,
    sigName: sigName,
    sigNameShort: sigNameShort,
    sig: sig,
  }
}

const parseNamespace = (fileName: string, data: string, lineOffset: number): Signature[] => {
  const sigs: Signature[] = []
  data.split('\n').forEach((line, lineNr) => {
    const parsed = parseLine(fileName, line, lineNr + lineOffset)
    if (parsed !== null) sigs.push(parsed)
  })
  return sigs
}

const parseFile = (data: string): Signature[] => {
  const sigs: Signature[] = []

  let offset = 0
  for (;;) {
    const nameStart = data.indexOf('namespace "', offset)
    if (nameStart === -1) break
    const nameEnd = data.indexOf('"', nameStart + 11)
    if (nameEnd === -1) break

    const sigsStart = data.indexOf('{', nameEnd + 1)
    if (sigsStart === -1) break
    const sigsEnd = data.indexOf('}', sigsStart + 1)
    if (sigsEnd === -1) break

    const name = data.substring(nameStart + 11, nameEnd).toLowerCase()
    const content = data.substring(sigsStart + 1, sigsEnd).trim()
    parseNamespace(name, content, offset)

    offset = sigsEnd + 1
  }

  return sigs
}

export const loadSignatures = async (signal?: AbortSignal): Promise<Signature[]> => {
  const data = await Fetch.fetchOne(url, signal)
  return parseFile(data)
}
