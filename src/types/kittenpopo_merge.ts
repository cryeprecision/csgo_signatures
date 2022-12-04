import { compareStrings } from './compare'
import { Signature as SigRepo } from './kittenpopo_repo'
import { Signature as SigSite } from './kittenpopo_site'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const binarySearchString = (hay: readonly SigSite[], needle: SigRepo): number => {
  let lower = 0
  let upper = hay.length - 1

  while (lower < upper) {
    const mid = Math.floor((lower + upper) / 2)
    const cmp = compareStrings(hay[mid].sigName, needle.sigName)
    if (cmp === -1) lower = mid + 1
    else if (cmp === 1) upper = mid - 1
    else return mid
  }

  return -1
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const sortPartial = <T>(array: T[], start: number, end: number, compareFn: (lhs: T, rhs: T) => number): void => {
  const sorted = array.slice(start, end).sort(compareFn)
  array.splice(start, sorted.length, ...sorted)
}

const dedup = <T>(array: T[], sameBucket: (lhs: T, rhs: T) => boolean): T[][] => {
  if (array.length < 2) return []
  const deleted: T[][] = []

  for (let i = array.length - 1; i !== 0; ) {
    let dupes = 0
    let j = i - 1
    for (; j !== -1; j -= 1) {
      if (sameBucket(array[i], array[j])) {
        dupes += 1
      } else break
    }
    if (dupes !== 0) {
      deleted.push(array.splice(j + 1, dupes))
    }

    if (j === -1) break
    else i = j
  }

  return deleted
}

// all elements in `site` have the same name and correspond to the same file
const reduceWindowInner = (window: SigSite[]): SigSite[] => {
  window.sort((lhs, rhs) => {
    const cmp = compareStrings(lhs.fileName, rhs.fileName)
    return cmp !== 0 ? cmp : compareStrings(lhs.sig, rhs.sig)
  })
  dedup(window, (lhs, rhs) => compareStrings(lhs.fileName, rhs.fileName) === 0 && lhs.sig === rhs.sig)
  return window
}

// merge all elements from the range [start, end)
// all elements in [start, end) have the same name
const reduceWindow = (site: SigSite[], start: number, end: number): void => {
  site.splice(start, end - start, ...reduceWindowInner(site.slice(start, end)))
}

const reduceSignatures = (site: SigSite[]): void => {
  if (site.length < 2) return

  for (let i = site.length - 1; i !== 0; ) {
    let j = i - 1
    for (; j !== -1 && compareStrings(site[i].sigName, site[j].sigName) === 0; j -= 1) {
      /* empty */
    }
    if (j !== i - 1) reduceWindow(site, j + 1, i + 1)

    if (j === -1) break
    else i = j
  }
}

const mergeSignatures_ = (site: SigSite[], repo: readonly SigRepo[]): void => {
  site.push(...repo.map(sig => ({ ...sig, source: 'repo' })))
  site.sort((lhs, rhs) => compareStrings(lhs.sigName, rhs.sigName))
  reduceSignatures(site)
}

export const mergeSignatures = (site: SigSite[], repo: readonly SigRepo[]): void => {
  console.time('mergeSignatures')
  mergeSignatures_(site, repo)
  console.timeEnd('mergeSignatures')
}
