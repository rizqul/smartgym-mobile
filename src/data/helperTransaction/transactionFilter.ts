import { TransactionStatus, TransactionsResponse } from "@/type/Transaction.type"
import { getStatusUI } from "@/utils/transactionHelper"

export type FilterOption<T extends string> = { label: string; value: T }

// ---------- TYPE ----------
export type TypeFilter = "ALL" | TransactionsResponse["type"]

export const TYPE_OPTIONS: FilterOption<TypeFilter>[] = [
  { label: "All", value: "ALL" },
  { label: "Trainer Booking", value: "PT_BOOKING" },
  { label: "Membership", value: "MEMBERSHIP" }
]

// ---------- STATUS ----------
export type StatusFilter = "ALL" | TransactionStatus

const STATUS_LIST: TransactionStatus[] = ["SUCCESS", "PENDING", "PROCESS", "CHALLENGE", "FAILURE", "EXPIRED", "CANCELLED"]

export const STATUS_OPTIONS: FilterOption<StatusFilter>[] = [
  { label: "All statuses", value: "ALL" },
  ...STATUS_LIST.map((s) => ({ label: getStatusUI(s).label, value: s as StatusFilter }))
]

// ---------- SORT ----------
export type SortOption = "NEWEST" | "OLDEST" | "CHEAPEST" | "PRICIEST"

export const SORT_OPTIONS: {
  value: SortOption
  label: string
  sortBy: "createdAt" | "amount"
  direction: "asc" | "desc"
}[] = [
  { value: "NEWEST", label: "Newest", sortBy: "createdAt", direction: "desc" },
  { value: "OLDEST", label: "Oldest", sortBy: "createdAt", direction: "asc" },
  { value: "CHEAPEST", label: "Lowest price", sortBy: "amount", direction: "asc" },
  { value: "PRICIEST", label: "Highest price", sortBy: "amount", direction: "desc" }
]

// ---------- STATE ----------
export type TransactionFilterState = {
  type: TypeFilter
  status: StatusFilter
  sort: SortOption
}

export const DEFAULT_FILTER: TransactionFilterState = {
  type: "ALL",
  status: "ALL",
  sort: "NEWEST"
}
