import { MaterialIcons } from "@expo/vector-icons"
import React, { useState } from "react"
import { Pressable, Text, View } from "react-native"

type MembershipConsultCardProps = {
  title?: string
  description?: string
  buttonLabel?: string
  onPress?: () => void
  bottomOffset?: number
}

const ICON_COLOR = "#FFD166"

export default function MembershipConsultCard({
  title = "Need Help Choosing a Membership?",
  description = "Contact the SmartGym Concierge team 24/7",
  buttonLabel = "Chat with Support",
  onPress,
  bottomOffset = 24
}: Readonly<MembershipConsultCardProps>) {
  const [expanded, setExpanded] = useState(false)

  return (
    <View
      pointerEvents="box-none"
      className="absolute right-4 items-end gap-3"
      style={{ bottom: bottomOffset }}
    >
      {/* Panel expanded */}
      {expanded ? (
        <View className="w-72 gap-3 rounded-2xl border border-secondary/30 bg-surface p-4 shadow-lg shadow-black/50">
          <View className="flex-row items-start justify-between gap-2">
            <View className="flex-1 gap-0.5">
              <Text className="font-inter text-sm font-bold text-text-primary">{title}</Text>
              <Text className="font-inter text-xs leading-5 text-text-secondary">{description}</Text>
            </View>

            <Pressable
              onPress={() => setExpanded(false)}
              accessibilityRole="button"
              accessibilityLabel="Close"
              hitSlop={8}
              className="active:opacity-70"
            >
              <MaterialIcons
                name="close"
                size={18}
                color="#9CA3AF"
              />
            </Pressable>
          </View>

          <Pressable
            onPress={onPress}
            accessibilityRole="button"
            accessibilityLabel={buttonLabel}
            className="flex-row items-center justify-center gap-2 rounded-xl bg-secondary py-3 active:opacity-80"
          >
            <MaterialIcons
              name="chat"
              size={16}
              color="#111317"
            />
            <Text className="font-inter text-xs font-bold text-background">{buttonLabel}</Text>
          </Pressable>
        </View>
      ) : null}

      {/* FAB */}
      <Pressable
        onPress={() => setExpanded((prev) => !prev)}
        accessibilityRole="button"
        accessibilityLabel="Membership consultation"
        accessibilityState={{ expanded }}
        className="h-14 w-14 items-center justify-center rounded-full border border-secondary/40 bg-card shadow-lg shadow-black/50 active:opacity-80"
      >
        <MaterialIcons
          name={expanded ? "keyboard-arrow-down" : "headset-mic"}
          size={26}
          color={ICON_COLOR}
        />
      </Pressable>
    </View>
  )
}
