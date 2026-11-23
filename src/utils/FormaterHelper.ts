export const FormatRupiah = (amount: number) => {
  if (amount === 0) return "Rp 0 - Voucher"
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(amount)
}

export const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })
}

export const FormatTime = (dateString: string) => {
  const date = new Date(dateString)
  return {
    hour: date.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }).split(".")[0],
    minute: date.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }).split(".")[1]
  }
}
