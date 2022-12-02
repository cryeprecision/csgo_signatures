import { Signature as SigRepo } from './kittenpopo_repo'
import { Signature as SigSite } from './kittenpopo_site'

export const mergeSignatures = (site: SigSite[], repo: SigRepo[]): SigSite[] => {
  const mapRepoToSite = repo.map(repoSig =>
    site.findIndex(
      siteSig => siteSig.sigName === repoSig.sigName || siteSig.sig.includes(repoSig.sig) || repoSig.sig.includes(siteSig.sig),
    ),
  )

  mapRepoToSite.forEach((siteIndex, repoIndex) => {
    if (siteIndex === -1) console.log(repo[repoIndex])
  })

  return site
}
