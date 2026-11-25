import { formatRupiah, isTrainerBooking, parseTransactionName } from "@/utils/FormaterHelper"
import React from "react"
import { Text, View } from "react-native"

type Props = {
  typeLabel: string
  statusLabel: string
  statusTextColor: string
  name: string
  amount: number
}

export function TransactionSummaryCard({ typeLabel, statusLabel, statusTextColor, name, amount }: Props) {
  const { displayName, sessionTime } = parseTransactionName(name, typeLabel)

  return (
    <View className="w-full rounded-2xl border border-border/50 bg-card p-5">
      <Text className={`mb-3 font-inter text-xs font-bold uppercase tracking-widest ${statusTextColor}`}>
        {typeLabel} • {statusLabel}
      </Text>
      <Text className="mb-4 font-inter text-2xl font-bold text-text-primary">{displayName}</Text>
      {isTrainerBooking(typeLabel) && (
        <View className="flex-row">
          <Text className="mb-4 font-inter text-sm font-medium text-text-secondary">Training Session : </Text>
          <Text className="mb-4 font-inter text-sm font-medium text-text-secondary">{sessionTime} WIB</Text>
        </View>
      )}
      <Text className="font-inter text-3xl font-extrabold text-primary">{formatRupiah(amount)}</Text>
    </View>
  )
}
