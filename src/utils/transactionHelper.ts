import { TransactionStatus } from "@/type/Transaction.type"

export const getStatusUI = (status: TransactionStatus) => {
  switch (status) {
    case "SUCCESS":
      return { label: "Successful", color: "success", textColor: "text-success", bgColor: "bg-success/15" }
    case "PENDING":
      return { label: "Pending", color: "secondary", textColor: "text-secondary", bgColor: "bg-secondary/15" }
    case "PROCESS":
      return { label: "Processing", color: "info", textColor: "text-info", bgColor: "bg-info/15" }
    case "CHALLENGE":
      return { label: "Under Review", color: "warning", textColor: "text-warning", bgColor: "bg-warning/15" }
    case "FAILURE":
      return { label: "Failed", color: "danger", textColor: "text-danger", bgColor: "bg-danger/15" }
    case "EXPIRED":
      return { label: "Expired", color: "text-muted", textColor: "text-text-muted", bgColor: "bg-text-muted/15" }
    case "CANCELLED":
      return { label: "Cancelled", color: "text-muted", textColor: "text-text-muted", bgColor: "bg-text-muted/15" }
    default:
      return { label: status, color: "text-secondary", textColor: "text-text-secondary", bgColor: "bg-surface" }
  }
}
