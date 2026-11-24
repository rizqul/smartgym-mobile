import { TransactionStatus, TransactionsResponse } from "@/type/Transaction.type"
import { getStatusUI } from "@/utils/transactionHelper"

export type FilterOption<T extends string> = { label: string; value: T }

// ---------- TYPE ----------
export type TypeFilter = "ALL" | TransactionsResponse["type"]

export const TYPE_OPTIONS: FilterOption<TypeFilter>[] = [
  { label: "All", value: "ALL" },
  { label: "Trainer Booking", value: "PT_BOOKING" as TypeFilter },
  { label: "Membership", value: "MEMBERSHIP" as TypeFilter }
]

// ---------- PERIOD ----------
export type PeriodFilter = "ALL" | "7D" | "30D" | "THIS_MONTH" | "90D"

export const PERIOD_OPTIONS: FilterOption<PeriodFilter>[] = [
  { label: "All periods", value: "ALL" },
  { label: "Last 7 days", value: "7D" },
  { label: "Last 30 days", value: "30D" },
  { label: "This month", value: "THIS_MONTH" },
  { label: "Last 3 months", value: "90D" }
]

// ---------- STATUS ----------
export type StatusFilter = "ALL" | TransactionStatus

const STATUS_LIST: TransactionStatus[] = ["SUCCESS", "PENDING", "PROCESS", "CHALLENGE", "FAILURE", "EXPIRED", "CANCELLED"]

export const STATUS_OPTIONS: FilterOption<StatusFilter>[] = [
  { label: "All statuses", value: "ALL" },
  ...STATUS_LIST.map((s) => ({ label: getStatusUI(s).label, value: s as StatusFilter }))
]

// ---------- SORT ----------
export type SortOption = "NEWEST" | "OLDEST" | "AMOUNT_HIGH" | "AMOUNT_LOW"

export const SORT_OPTIONS: FilterOption<SortOption>[] = [
  { label: "Newest first", value: "NEWEST" },
  { label: "Oldest first", value: "OLDEST" },
  { label: "Highest amount", value: "AMOUNT_HIGH" },
  { label: "Lowest amount", value: "AMOUNT_LOW" }
]

// ---------- LOGIC ----------
export type TransactionFilterState = {
  type: TypeFilter
  period: PeriodFilter
  status: StatusFilter
  sort: SortOption
}

export const DEFAULT_FILTER: TransactionFilterState = {
  type: "ALL",
  period: "ALL",
  status: "ALL",
  sort: "NEWEST"
}

const DAY_MS = 24 * 60 * 60 * 1000

const getPeriodStart = (period: PeriodFilter): number | null => {
  const now = new Date()
  switch (period) {
    case "7D":
      return now.getTime() - 7 * DAY_MS
    case "30D":
      return now.getTime() - 30 * DAY_MS
    case "90D":
      return now.getTime() - 90 * DAY_MS
    case "THIS_MONTH":
      return new Date(now.getFullYear(), now.getMonth(), 1).getTime()
    default:
      return null
  }
}

export const filterAndSortTransactions = (list: TransactionsResponse[], f: TransactionFilterState): TransactionsResponse[] => {
  const periodStart = getPeriodStart(f.period)

  const filtered = list.filter((item) => {
    if (f.type !== "ALL" && item.type !== f.type) return false
    if (f.status !== "ALL" && item.status !== f.status) return false
    if (periodStart !== null && new Date(item.createdAt).getTime() < periodStart) return false
    return true
  })

  return filtered.sort((a, b) => {
    switch (f.sort) {
      case "OLDEST":
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      case "AMOUNT_HIGH":
        return b.amount - a.amount
      case "AMOUNT_LOW":
        return a.amount - b.amount
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    }
  })
}
