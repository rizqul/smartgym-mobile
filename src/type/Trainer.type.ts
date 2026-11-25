
export interface Trainer {
  id: string
  name: string
  email: string
  profileUrl: string
  phoneNumber: string
  specialization: string
  experience: number
  rate: number
}

export interface TrainerSlot {
  id: string
  description: string
  startTime: string
  endTime: string
  status: string
  createdAt: string
  updatedAt: string
}
