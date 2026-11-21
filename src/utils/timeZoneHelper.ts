export const getTimezoneLabel = (): string => {
  const offset = -new Date().getTimezoneOffset() / 60
  const names: Record<number, string> = { 7: "WIB", 8: "WITA", 9: "WIT" }
  const gmt = `GMT${offset >= 0 ? "+" : ""}${offset}`
  return names[offset] ? `${names[offset]} (${gmt})` : gmt
}
