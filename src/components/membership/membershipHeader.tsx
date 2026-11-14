import React from "react"
import { Text, View } from "react-native"

type MembershipHeaderProps = {
  badge?: string
  title?: string
  subtitle?: string
}

export default function MembershipHeader({
  badge = "MEMBERSHIP SUITE",
  title = "Membership & Paket",
  subtitle = "Kelola status langganan dan pilih paket terbaik untuk capai fitness goal-mu."
}: MembershipHeaderProps) {
  return (
    <View className="w-[370] gap-3">
      {/* Badge */}
      <View className="flex-row items-center gap-2 self-start rounded-full border border-primary/30 bg-primary/15 px-3 py-1.5">
        <View className="h-1.5 w-1.5 rounded-full bg-primary" />
        <Text className="text-[10px] font-bold tracking-widest text-primary">{badge}</Text>
      </View>

      {/* Title + subtitle */}
      <View className="gap-2">
        <Text className="text-3xl font-bold text-text-primary">{title}</Text>
        <Text className="text-text-warm text-sm leading-6">{subtitle}</Text>
      </View>
    </View>
  )
}
