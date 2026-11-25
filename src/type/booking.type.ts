export type BookingStatus = "PENDING" | "PAID" | "CANCELLED"

export interface BookingHistory {
  id: string
  bookedAt: string
  status?: BookingStatus
  trainer: {
    id: string
    name: string
    profileUrl?: string
    specialization: string
  }
  slot: {
    startTime: string
    endTime: string
  }
}
