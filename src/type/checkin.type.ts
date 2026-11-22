export interface CheckinResponse {
  id: string
  memberName: string
  memberId: string
  membershipExpiresAt: string
  method: "RFID" | "QR"
  status: "GRANTED" | "DENIED"
  checkInAt: string
  checkOutAt: string
  denialReason: string | null
  duplicate: boolean
}
