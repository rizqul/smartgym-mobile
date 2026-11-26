import { User } from "./user.type"

export type CheckinStatus = "ACCEPTED" | "DECLINED"

export type CheckinMethod = "RFID" | "QR"

export interface CheckinResponse {
  id: string
  member: User
  method: CheckinMethod
  status: CheckinStatus
  checkInAt: string
  checkOutAt: string | null
  denialReason: string | null
}

export interface MyCheckinRequest {
  page?: number
  size?: number
  status?: CheckinStatus
}

export interface MyCheckinResponse {
  data: CheckinResponse[]
  paginate: {
    size: number
    currentPage: number
    totalPages: number
    totalData: number
    prevUrl: number | null
    nextUrl: number | null
  }
}

export interface SummaryCheckin {
  totalGymMinutes: number
  totalGymHours: number
  currentStreak: number
  longestStreak: number
  totalVisits: number
  lastCheckInAt: string
  checkedInToday: boolean
}
