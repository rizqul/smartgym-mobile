export type TransactionStatus = "PENDING" | "PAID" | "FAILED" | "EXPIRED" | "REFUNDED"
export type TransactionType = "MEMBERSHIP" | "PT_BOOKING"

export interface TransactionData {
  id: number
  member_id: number
  type: TransactionType
  amount: number
  status: TransactionStatus
  midtrans_order_id: string
  paid_at: string | null
  created_at: string
  //   relation
  relation_data: {
    title: string
    description: string
    extra_info: string
  }
}
