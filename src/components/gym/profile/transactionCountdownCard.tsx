import { formatDateTime } from "@/utils/FormaterHelper"
import { formatCountdown } from "@/utils/countdownHelper"
import React from "react"
import { Text, View } from "react-native"

type Props = {
  expiredAt: string
  remaining: number
  isTimeUp: boolean
}

export function TransactionCountdownCard({ expiredAt, remaining, isTimeUp }: Props) {
  return (
    <View className="w-full items-center rounded-2xl border border-secondary/30 bg-secondary/10 p-4">
      {isTimeUp ? (
        <>
          <Text className="font-inter text-sm font-bold text-secondary">Payment time has expired</Text>
          <Text className="mt-1 text-center font-inter text-xs text-text-secondary">Checking the latest status of your transaction…</Text>
        </>
      ) : (
        <>
          <Text className="font-inter text-xs font-bold uppercase tracking-widest text-text-secondary">Complete your payment within</Text>
          <Text className="mt-1 font-inter text-3xl font-extrabold text-secondary">{formatCountdown(remaining)}</Text>
          <Text className="mt-1 font-inter text-xs text-text-secondary">Deadline: {formatDateTime(expiredAt)}</Text>
        </>
      )}
    </View>
  )
}
