export const compareStrings = (lhs: string, rhs: string, isLower?: boolean): number => {
  const lhs_ = isLower ?? false ? lhs : lhs.toLowerCase()
  const rhs_ = isLower ?? false ? rhs : rhs.toLowerCase()

  if (lhs_ < rhs_) return -1
  else if (lhs_ > rhs_) return 1
  else return 0
}
