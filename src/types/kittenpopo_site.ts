import * as Fetch from './fetch'
import { omitBrackets } from './omit_brackets'

const prefix = 'https://raw.githubusercontent.com/KittenPopo/csgo-offsets/site/rawsigdata/'
// const prefix = './real_resources/'
// const prefix = './test_resources/'

const resources = [
  'client_funcs.c',
  'engine_funcs.c',
  'server_funcs.c',
  'filesystem_stdio_funcs.c',
  'panorama_funcs.c',
  'panoramauiclient_funcs.c',
]

export type ClassInfo = {
  readonly name: string
  readonly nameShort?: string
  readonly vTableIndex: number
}

export type Signature = {
  readonly fileName: string
  readonly lineNr: number
  readonly sigName: string
  readonly sigNameShort?: string
  readonly sig: string
  readonly source?: string
  readonly classInfo?: ClassInfo
}

export const matchesSearchSignature = (sig: Signature, search: string): boolean => {
  if (search === '') return true
  return (
    sig.sigName.toLowerCase().includes(search) ||
    sig.sig.toLowerCase().includes(search) ||
    sig.fileName.toLowerCase().includes(search) ||
    (sig.source !== undefined && sig.source.toLowerCase().includes(search)) ||
    (sig.classInfo !== undefined &&
      (sig.classInfo.name.toLowerCase().includes(search) || sig.classInfo.vTableIndex.toString().includes(search)))
  )
}

const omitLongTemplates = (text: string): string | null => {
  return omitBrackets(text, ['<', '>'], 1, '[...]', 10)
}

const shortenClassName = (name: string): string | undefined => {
  let omitted = name

  omitted = omitLongTemplates(name) ?? 'INVALID'

  return omitted === name ? undefined : omitted
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

const parseClassInfo = ([className, vTableIndex]: (string | undefined)[]): ClassInfo | undefined => {
  if (className === undefined || vTableIndex === undefined) return undefined
  const shortClassName = shortenClassName(className)
  return { name: className, nameShort: shortClassName, vTableIndex: parseInt(vTableIndex) }
}
const parseLine = (fileName: string, line: string, lineNr: number): Signature | null => {
  const splits = line.replace('\r', '').split('=')
  if (splits.length < 2) return null

  const [sigName, sig, ...splits_] = splits
  const shortSigName = shortenSigName(sigName)

  const [source, ...splits__] = splits_ as (string | undefined)[]

  return {
    fileName: fileName,
    lineNr: lineNr,
    sigName: sigName,
    sigNameShort: shortSigName,
    sig: sig,
    source: source,
    classInfo: parseClassInfo(splits__),
  }
}
const parseFile = (fileName: string, data: string): Signature[] => {
  const sigs: Signature[] = []
  data.split('\n').forEach((line, index) => {
    const parsed = parseLine(fileName, line, index)
    if (parsed !== null) sigs.push(parsed)
  })
  return sigs
}
const fileNameFromUrl = (url: string): string => {
  return url.substring(url.lastIndexOf('/') + 1, url.length - 8)
}

export const loadSignaturesSite = async (signal?: AbortSignal): Promise<Signature[]> => {
  const urls = resources.map(suffix => prefix + suffix)
  const results = await Fetch.fetchAll(urls, signal)
  return results.reduce<Signature[]>((acc, next): Signature[] => {
    return acc.concat(parseFile(fileNameFromUrl(next.url), next.data))
  }, [])
}
