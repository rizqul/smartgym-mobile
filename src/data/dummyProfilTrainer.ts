export const DATES = [
  { day: "Sen", date: "27", active: false, disabled: true },
  { day: "Sel", date: "28", active: true, disabled: false, hasDot: true },
  { day: "Rab", date: "29", active: false, disabled: false, hasDot: true },
  { day: "Kam", date: "30", active: false, disabled: false, hasDot: true },
  { day: "Jum", date: "31", active: false, disabled: false, hasDot: true },
  { day: "Sab", date: "01", active: false, disabled: false, hasDot: true },
  { day: "Min", date: "02", active: false, disabled: true }
]

export const SLOTS = [
  { id: "1", time: "08.00 - 09.00", title: "Sesi Pagi Utama", status: "Available", slots: "2 Slot Left", isPrimary: true },
  { id: "2", time: "09.00 - 10.00", title: "Sesi Pagi", status: "Available", slots: "3 Slot Left" },
  { id: "3", time: "10.00 - 11.00", title: "Sesi Menjelang Siang", status: "Limited Slot", slots: "1 Slot Left" },
  { id: "4", time: "13.00 - 14.00", title: "Sesi Siang", status: "Available", slots: "2 Slot Left" },
  { id: "5", time: "16.00 - 17.00", title: "Sesi Sore Peak", status: "Full Booked", slots: "Penuh", disabled: true },
  { id: "6", time: "17.00 - 18.00", title: "Sesi Sore Akhir", status: "Limited Slot", slots: "1 Slot Left" }
]
