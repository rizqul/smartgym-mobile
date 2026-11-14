import { MaterialIcons } from "@expo/vector-icons"
import React from "react"
import { Pressable, Text, View } from "react-native"

type MembershipConsultCardProps = {
  title?: string
  description?: string
  buttonLabel?: string
  onPress?: () => void
}

const ICON_COLOR = "#FFD166"

export default function MembershipConsultCard({
  title = "Butuh Konsultasi Paket?",
  description = "Hubungi tim Concierge SmartGym 24/7",
  buttonLabel = "Chat Admin",
  onPress
}: MembershipConsultCardProps) {
  return (
    <View className="w-full flex-row items-center gap-3 rounded-2xl border border-border bg-surface p-4">
      {/* Icon */}
      <View className="h-12 w-12 items-center justify-center rounded-full bg-secondary/15">
        <MaterialIcons
          name="headset-mic"
          size={22}
          color={ICON_COLOR}
        />
      </View>

      {/* Text */}
      <View className="flex-1 gap-0.5">
        <Text className="text-sm font-bold text-text-body">{title}</Text>
        <Text className="text-text-warm text-xs leading-5">{description}</Text>
      </View>

      {/* Button */}
      <Pressable
        onPress={onPress}
        className="items-center justify-center rounded-xl bg-card px-4 py-3 active:opacity-80"
        accessibilityRole="button"
        accessibilityLabel={buttonLabel}
      >
        <Text className="text-center text-xs font-bold text-text-body">{buttonLabel}</Text>
      </Pressable>
    </View>
  )
}
