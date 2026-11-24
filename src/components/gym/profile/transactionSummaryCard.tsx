import { formatRupiah } from "@/utils/FormaterHelper"
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
  return (
    <View className="w-full rounded-2xl border border-border/50 bg-card p-5">
      <Text className={`mb-3 font-inter text-xs font-bold uppercase tracking-widest ${statusTextColor}`}>
        {typeLabel} • {statusLabel}
      </Text>
      <Text className="mb-4 font-inter text-2xl font-bold text-text-primary">{name}</Text>
      <Text className="font-inter text-3xl font-extrabold text-primary">{formatRupiah(amount)}</Text>
    </View>
  )
}
