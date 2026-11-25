import { TransactionsResponse } from "@/type/Transaction.type"
import { formatDate, formatRupiah, parseTransactionName } from "@/utils/FormaterHelper"
import { getStatusUI } from "@/utils/transactionHelper"
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons"
import { Text, TouchableOpacity, View } from "react-native"

export const TransactionCard = ({ item, showDetail }: { item: TransactionsResponse; showDetail: () => void }) => {
  const statusUI = getStatusUI(item.status)
  const isPending = item.status === "PENDING"

  const iconName = item.type === "PT_BOOKING" ? "dumbbell" : "card-account-details-outline"
  const typeLabel = item.type === "PT_BOOKING" ? "Trainer Booking" : "Membership"
  const { displayName, sessionTime } = parseTransactionName(item.name, typeLabel)

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
          <Text className="font-inter text-xs font-semibold text-text-secondary">{typeLabel}</Text>
        </View>
        <View className={`rounded-md px-2 py-1 ${statusUI.bgColor}`}>
          <Text className={`font-inter text-xs font-bold ${statusUI.textColor}`}>{statusUI.label}</Text>
        </View>
      </View>

      {/* Body Card */}
      <View className="mb-3">
        <Text className="mb-1 font-inter text-sm font-bold text-text-primary">{displayName}</Text>
        {isPending && item.expiredAt ? (
          <Text className="mb-1 font-inter text-xs text-text-secondary">Pay before {formatDate(item.expiredAt)}</Text>
        ) : null}
        <Text className="font-inter text-xs text-text-secondary">
          #{item.orderId} • {formatDate(item.createdAt)}
        </Text>
      </View>

      {/* Footer Card */}
      <View className="flex-row items-center justify-between border-t border-border/30 pt-3">
        <Text className="font-inter text-sm font-bold text-text-primary">{formatRupiah(item.amount)}</Text>

        <TouchableOpacity
          className="flex-row items-center gap-1"
          onPress={showDetail}
        >
          <Text className={`font-inter text-sm font-semibold ${isPending ? "text-secondary" : "text-primary"}`}>
            {isPending ? "Pay now" : "View details"}
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
