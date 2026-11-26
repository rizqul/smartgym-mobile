export const formatRupiah = (amount: number) => {
  if (amount === 0) return "Rp 0 - Voucher"
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(amount)
}

export const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })
}

export const formatDateTime = (iso: string) =>
  new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  })

export const formatTime = (dateString: string) => {
  const date = new Date(dateString)
  return {
    hour: date.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }).split(".")[0],
    minute: date.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }).split(".")[1]
  }
}

const TIME_LOCALE = "en-GB"

export const formatTimeSlot = (iso: string): string => {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso.substring(11, 16)
  return d.toLocaleTimeString(TIME_LOCALE, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Asia/Jakarta"
  })
}

export const formatRange = (start: string, end: string) => `${formatTimeSlot(start)} - ${formatTimeSlot(end)}`

export const toTitleCase = (str: string) =>
  str
    .trim()
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase())

export const isTrainerBooking = (typeLabel: string) => typeLabel.toUpperCase() === "TRAINER BOOKING"

export const parseTransactionName = (name: string, typeLabel: string) => {
  if (!isTrainerBooking(typeLabel)) {
    return { displayName: name, sessionTime: "" }
  }

  const [rawName, rawSlot] = name.split("[")
  const slot = rawSlot?.replace("]", "")

  return {
    displayName: "Coach " + toTitleCase(rawName),
    sessionTime: slot ? formatRange(slot.substring(0, 20), slot.substring(23, 43)) : ""
  }
}
