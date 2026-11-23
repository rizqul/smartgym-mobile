import api from "./api"

export const getAllTransactions = async () => {
  const response = await api.get("/member/transactions")
  return response.data
}

export const getTransactionById = async (id: string) => {
  const response = await api.get(`/member/transactions/${id}`)
  return response.data
}

export const checkTransactionStatus = async (orderId: string) => {
  const response = await api.get(`/member/transactions/check/${orderId}`)
  return response.data
}

export const cancelTransaction = async (orderId: string, token: string) => {
  const response = await api.post(`/member/transactions/cancel/${orderId}`, { token })
  return response.data
}
