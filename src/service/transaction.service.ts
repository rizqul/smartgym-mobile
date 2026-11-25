import { TransactionStatus, TransactionType } from "@/type/Transaction.type"
import api from "./api"

export type GetTransactionsParams = {
  type?: TransactionType
  status?: TransactionStatus
  sortBy?: "createdAt" | "amount"
  direction?: "asc" | "desc"
  size?: number
}

export const getAllTransactions = async (params?: GetTransactionsParams) => {
  const response = await api.get("/member/transactions", {
    params: {
      type: params?.type,
      status: params?.status,
      sortBy: params?.sortBy,
      direction: params?.direction,
      size: params?.size
    }
  })
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
