export const isMembershipActive = (expiredAt?: string | null) => {
  if (!expiredAt) return false
  const time = new Date(expiredAt).getTime()
  return Number.isFinite(time) && time > Date.now()
}
