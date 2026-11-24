import { formatRupiah } from "@/utils/FormaterHelper"
import React from "react"
import { Text, View } from "react-native"

export function TransactionPaymentBreakdown({ amount }: { amount: number }) {
  return (
    <View className="w-full rounded-2xl border border-border/50 bg-card p-5">
      <Text className="mb-4 font-inter text-sm font-bold text-text-primary">Payment details</Text>

      <View className="gap-2">
        <View className="flex-row items-center justify-between">
          <Text className="font-inter text-sm text-text-secondary">Package price</Text>
          <Text className="font-inter text-sm font-bold text-text-primary">{formatRupiah(amount)}</Text>
        </View>
        <View className="mt-2 flex-row items-center justify-between border-t border-border/30 pt-3">
          <Text className="font-inter text-sm font-bold text-text-primary">Total payment</Text>
          <Text className="font-inter text-sm font-bold text-text-primary">{formatRupiah(amount)}</Text>
        </View>
      </View>
    </View>
  )
}
