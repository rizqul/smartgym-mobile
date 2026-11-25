import api from "./api"
export type GetMyBookingsParams = {
  search?: string
  size?: number
}

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

export const getMyBookings = async (params?: GetMyBookingsParams) => {
  const response = await api.get("/member/trainers/booking", {
    params: {
      search: params?.search || undefined,
      size: params?.size
    }
  })
  return response.data
}

export const bookingTrainer = async (slotId: string, paymentType: string) => {
  const response = await api.post(`/member/trainers/booking`, { slotId, paymentType })
  return response.data.data
}
