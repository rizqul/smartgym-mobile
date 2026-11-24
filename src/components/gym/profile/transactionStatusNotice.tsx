import { TransactionStatus } from "@/type/Transaction.type"
import React from "react"
import { Text, View } from "react-native"

export function TransactionStatusNotice({ status }: { status: TransactionStatus }) {
  if (status === "SUCCESS") {
    return (
      <View className="w-full rounded-2xl border border-success/20 bg-[#1A2E22] p-4">
        <Text className="mb-1 font-inter text-sm font-bold text-success">Payment recorded</Text>
        <Text className="font-inter text-sm leading-5 text-[#74C69D]">
          Use the Digital Pass from the Pass menu. Do not use the transaction receipt as an entry QR code.
        </Text>
      </View>
    )
  }

  if (status === "PROCESS" || status === "CHALLENGE") {
    return (
      <View className="w-full rounded-2xl border border-border/50 bg-surface p-4">
        <Text className="font-inter text-sm leading-5 text-text-secondary">
          {status === "PROCESS"
            ? "Your payment is being processed. Tap Check Status to see the latest progress."
            : "Your transaction is being reviewed by the payment provider. Tap Check Status to see the result."}
        </Text>
      </View>
    )
  }

  return null
}
