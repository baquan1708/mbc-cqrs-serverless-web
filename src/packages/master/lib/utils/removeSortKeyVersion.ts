export function removeSortKeyVersion(sk: string) {
  const lastDivIdx = sk.lastIndexOf('@')
  if (lastDivIdx === -1) {
    return sk
  }
  return sk.substring(0, lastDivIdx)
}
