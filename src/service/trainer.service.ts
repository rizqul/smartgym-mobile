import api from "./api"

export const getAllTrainers = async () => {
  const response = await api.get("/member/trainers")
  return response.data.data
}

export const getTrainerSlot = async (id: string, date?: string) => {
  const response = await api.get(`/member/trainers/slot/${id}`, { params: { date } })
  return response.data
}

export const bookingTrainer = async (slotId: string) => {
  const response = await api.post(`/member/trainers/booking`, { slotId })
  return response.data
}
