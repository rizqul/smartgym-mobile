import { formatDate, FormatRupiah } from "@/utils/FormaterHelper"
import { TransactionData, TransactionStatus } from "@/utils/types/Transaction.type"
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons"
import { Text, TouchableOpacity, View } from "react-native"

const getStatusUI = (status: TransactionStatus) => {
  switch (status) {
    case "PAID":
      return { label: "Berhasil", color: "success", textColor: "text-success", bgColor: "bg-success/15" }
    case "PENDING":
      return { label: "Menunggu", color: "secondary", textColor: "text-secondary", bgColor: "bg-secondary/15" }
    case "FAILED":
    case "EXPIRED":
      return { label: "Gagal/Kedaluwarsa", color: "danger", textColor: "text-danger", bgColor: "bg-danger/15" }
    case "REFUNDED":
      return { label: "Dikembalikan", color: "info", textColor: "text-info", bgColor: "bg-info/15" }
    default:
      return { label: status, color: "text-secondary", textColor: "text-text-secondary", bgColor: "bg-surface" }
  }
}

export const TransactionCard = ({ item }: { item: TransactionData }) => {
  const statusUI = getStatusUI(item.status)
  const isPending = item.status === "PENDING"

  // Icon berdasarkan TransactionType
  const iconName = item.type === "PT_BOOKING" ? "dumbbell" : "card-account-details-outline"
  const typeLabel = item.type === "PT_BOOKING" ? "Booking Trainer" : "Membership"

  return (
    <View className="rounded-2xl border border-border/50 bg-card px-5 py-4">
      {/* Header Card */}
      <View className="mb-3 flex-row items-start justify-between">
        <View className="flex-row items-center gap-2">
          <MaterialCommunityIcons
            name={iconName}
            size={16}
            color="#B8BDC7"
          />
          <Text className="text-[11px] font-semibold text-text-secondary">{typeLabel}</Text>
        </View>
        <View className={`rounded-md px-2 py-1 ${statusUI.bgColor}`}>
          <Text className={`text-[10px] font-bold ${statusUI.textColor}`}>{statusUI.label}</Text>
        </View>
      </View>

      {/* Body Card */}
      <View className="mb-3">
        <Text className="mb-1 text-sm font-bold text-text-primary">{item.relation_data.title}</Text>
        <Text className="mb-1 text-[11px] text-text-secondary">{item.relation_data.description}</Text>
        <Text className="text-[10px] text-text-secondary">
          #{item.midtrans_order_id} • {formatDate(item.created_at)}
        </Text>
      </View>

      {/* Footer Card */}
      <View className="flex-row items-center justify-between border-t border-border/30 pt-3">
        <Text className="text-sm font-bold text-text-primary">{FormatRupiah(item.amount)}</Text>

        <TouchableOpacity className="flex-row items-center gap-1">
          <Text className={`text-xs font-semibold ${isPending ? "text-secondary" : "text-primary"}`}>
            {isPending ? "Bayar sekarang" : "Lihat detail"}
          </Text>
          <Ionicons
            name="chevron-forward"
            size={14}
            color={isPending ? "#FFD166" : "#FF6B00"}
          />
        </TouchableOpacity>
      </View>
    </View>
  )
}
