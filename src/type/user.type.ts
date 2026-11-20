export interface User {
  id: string
  name: string
  email: string
  profileUrl: string
  role: string
  phoneNumber: string
  membershipStatus: string
  membershipExpiredAt: string | null
  createdAt: string
  updatedAt: string
}
