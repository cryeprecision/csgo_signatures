export type Bracket = '<' | '>' | '(' | ')' | '{' | '}' | '[' | ']'
export type BracketPair = ['<', '>'] | ['(', ')'] | ['{', '}'] | ['[', ']']

type BracketAt = { br: Bracket; at: number }

const findFirstBracket = (text: string, brackets: BracketPair, offset?: number): BracketAt | null => {
  for (let i = offset ?? 0; i < text.length; i += 1) {
    if (text[i] === brackets[0]) return { br: brackets[0], at: i }
    else if (text[i] === brackets[1]) return { br: brackets[1], at: i }
  }
  return null
}
const findAllBrackets = (text: string, brackets: BracketPair, offset?: number): BracketAt[] => {
  let buffer: BracketAt[] = []
  for (let i = offset ?? 0; i < text.length; i += 1) {
    if (text[i] === brackets[0]) buffer.push({ br: brackets[0], at: i })
    else if (text[i] === brackets[1]) buffer.push({ br: brackets[1], at: i })
  }
  return buffer
}

const balancedBrackets = (text: string, brackets: BracketPair): number => {
  let depth: number = 0
  let offset: number = 0
  for (let i = 0; i < 100; i += 1) {
    const next = findFirstBracket(text, brackets, offset)
    if (next === null) break

    depth += next.br === brackets[0] ? +1 : -1
    offset = next.at + 1

    if (depth < 0) break
  }
  return depth
}

const replaceSegment = (text: string, replacement: string, start: number, end: number): string => {
  return text.substring(0, start) + replacement + text.substring(end)
}

export const omitBrackets = (
  text: string,
  brackets: BracketPair,
  omitDepth?: number,
  replacement?: string,
  minLength?: number,
): string | null => {
  const omitDepth_ = Math.max(1, omitDepth ?? 1)
  const replacement_ = replacement ?? '[...]'
  const minLength_ = Math.max(1, minLength ?? 1)

  if (findFirstBracket(text, brackets) === null) return text
  if (balancedBrackets(text, brackets) !== 0) return null

  const allBrackets = findAllBrackets(text, brackets)

  let start: number = -1
  let depth: number = 0
  let offset: number = 0

  for (const bracket of allBrackets) {
    if (bracket.br === brackets[0]) depth += 1

    if (depth === omitDepth_) {
      if (start !== -1) {
        if (bracket.at - start - 1 >= minLength_) {
          text = replaceSegment(text, replacement_, start + 1 + offset, bracket.at + offset)
          offset += replacement_.length - (bracket.at - start - 1)
        }
        start = -1
      } else start = bracket.at
    }

    if (bracket.br === brackets[1]) depth -= 1
  }

  return text
}
