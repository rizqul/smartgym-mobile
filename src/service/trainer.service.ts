import api from "./api"

export const getAllTrainers = async (params?: { search?: string; page?: number; size?: number }) => {
  const response = await api.get("/member/trainers", {
    params: {
      search: params?.search || undefined,
      page: params?.page,
      size: params?.size
    }
  })
  return response.data.data
}

export const getTrainerSlot = async (id: string, date?: string) => {
  const response = await api.get(`/member/trainers/slot/${id}`, { params: { date } })
  return response.data
}

export const bookingTrainer = async (slotId: string, paymentType: string) => {
  const response = await api.post(`/member/trainers/booking`, { slotId, paymentType })
  return response.data.data
}
