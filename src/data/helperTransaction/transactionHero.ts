import { TransactionStatus } from "@/type/Transaction.type"
import { Ionicons } from "@expo/vector-icons"
import React from "react"

export type HeroConfig = {
  icon: React.ComponentProps<typeof Ionicons>["name"]
  title: string
  outer: string
  mid: string
  inner: string
}

export const HERO: Record<TransactionStatus, HeroConfig> = {
  SUCCESS: { icon: "checkmark", title: "Payment Successful!", outer: "bg-primary/5", mid: "bg-primary/20", inner: "bg-primary" },
  PENDING: { icon: "time", title: "Awaiting Payment", outer: "bg-secondary/5", mid: "bg-secondary/20", inner: "bg-secondary" },
  PROCESS: { icon: "sync", title: "Payment Processing", outer: "bg-info/5", mid: "bg-info/20", inner: "bg-info" },
  CHALLENGE: { icon: "shield-checkmark", title: "Under Review", outer: "bg-warning/5", mid: "bg-warning/20", inner: "bg-warning" },
  FAILURE: { icon: "close", title: "Payment Failed", outer: "bg-danger/5", mid: "bg-danger/20", inner: "bg-danger" },
  EXPIRED: { icon: "hourglass", title: "Payment Expired", outer: "bg-text-muted/5", mid: "bg-text-muted/20", inner: "bg-text-muted" },
  CANCELLED: { icon: "close", title: "Transaction Cancelled", outer: "bg-text-muted/5", mid: "bg-text-muted/20", inner: "bg-text-muted" }
}
