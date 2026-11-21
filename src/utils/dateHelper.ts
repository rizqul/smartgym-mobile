interface DateItem {
  day: string
  date: string
  fullDate: string
  disabled: boolean
  hasDot: boolean
}

export const generateUpcomingDates = (daysCount: number = 14): DateItem[] => {
  const daysName = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"]
  const result: DateItem[] = []
  const today = new Date()

  for (let i = 0; i < daysCount; i++) {
    const targetDate = new Date(today)
    targetDate.setDate(today.getDate() + i)

    const year = targetDate.getFullYear()
    const month = String(targetDate.getMonth() + 1).padStart(2, "0")
    const dayNumber = String(targetDate.getDate()).padStart(2, "0")

    result.push({
      day: daysName[targetDate.getDay()],
      date: dayNumber,
      fullDate: `${year}-${month}-${dayNumber}`,
      disabled: false,
      hasDot: i < 5
    })
  }

  return result
}
