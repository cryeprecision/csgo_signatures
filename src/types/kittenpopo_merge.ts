import { Signature as SigRepo } from './kittenpopo_repo'
import { Signature as SigSite } from './kittenpopo_site'

export const mergeSignatures = (site: SigSite[], repo: SigRepo[]): SigSite[] => {
  console.time('mergeSignatures')
  const mapRepoToSite = repo.map(repoSig => site.findIndex(siteSig => siteSig.sigName === repoSig.sigName))
  console.timeEnd('mergeSignatures')
  return site
}
