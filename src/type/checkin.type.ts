export interface CheckinResponse {
  id: string
  memberName: string
  memberId: string
  membershipName: string
  membershipExpiresAt: string
  method: "RFID" | "QR"
  status: "GRANTED" | "DENIED"
  checkInAt: string
  denialReason: string | null
}
