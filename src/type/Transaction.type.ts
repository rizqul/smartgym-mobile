export type TransactionStatus = "PENDING" | "PROCESS" | "SUCCESS" | "FAILURE" | "EXPIRED" | "CANCELLED" | "CHALLENGE"
export type TransactionType = "MEMBERSHIP" | "PT_BOOKING"

export interface TransactionData {
  id: number
  member_id: number
  type: TransactionType
  amount: number
  status: TransactionStatus
  midtrans_order_id: string
  paid_at: string | null
  payment_method: string | null
  created_at: string
  //   relation
  relation_data: {
    title: string
    description: string
    extra_info: string
  }
}

export enum PaymentType {
  OTHER_QRIS = "OTHER_QRIS",
  BCA_VA = "BCA_VA",
  ECHANNEL = "ECHANNEL",
  BNI_VA = "BNI_VA",
  BSI_VA = "BSI_VA",
  BRI_VA = "BRI_VA",
  SEABANK_VA = "SEABANK_VA",
  GOPAY = "GOPAY",
  DANA = "DANA",
  SHOPEEPAY = "SHOPEEPAY"
}

export interface UserTransactionResponse {
  id: string
  name: string
  email: string
  profileUrl: string | null
  phoneNumber: string | null
}

export interface PaginationLink {
  label: string
  active: boolean
  url: string | null
}

export interface PaginationMeta {
  size: number
  currentPage: number
  totalPages: number
  totalData: number
  prevUrl: string | null
  nextUrl: string | null
  links: PaginationLink[]
}

export interface TransactionsResponse {
  id: string
  orderId: string
  packageId: string
  name: string
  member: UserTransactionResponse
  type: TransactionType
  paymentUrl: string
  paymentType: PaymentType
  amount: number
  status: TransactionStatus
  paidAt: string | null
  expiredAt: string | null
  createdAt: string
  updatedAt: string
}

export interface PaginationTransactionResponse {
  data: TransactionsResponse[]
  pagination: PaginationMeta
}
