import api from "./api"

export const getAllTransactions = async () => {
  const response = await api.get("/member/transactions")
  return response.data
}

export const checkTransactionStatus = async (orderId: string) => {
  const response = await api.get(`/member/transactions/${orderId}`)
  return response.data
}

export const cancelTransaction = async (orderId: string) => {
  const response = await api.delete(`/member/transactions/${orderId}`)
  return response.data
}
