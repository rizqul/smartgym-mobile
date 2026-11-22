import api from "./api"

export const getAllTransactions = async () => {
  const response = await api.get("/member/transactions")
  return response.data
}

export const checkTransaction = async (id: string, orderId: string) => {
  const response = await api.get(`/member/transactions/${id}`, { params: { orderId } })
  return response.data
}

export const cancelTransaction = async (id: string, orderId: string) => {
  const response = await api.delete(`/member/transactions/${id}`, { params: { orderId } })
  return response.data
}
