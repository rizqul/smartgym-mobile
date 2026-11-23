export type CheckinStatus = "GRANTED" | "DENIED"

export type CheckinMethod = "RFID" | "QR"

export interface CheckinResponse {
  id: string
  memberName: string
  memberId: string
  membershipExpiresAt: string
  method: CheckinMethod
  status: CheckinStatus
  checkInAt: string
  checkOutAt: string | null
  denialReason: string | null
  duplicate: boolean
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
