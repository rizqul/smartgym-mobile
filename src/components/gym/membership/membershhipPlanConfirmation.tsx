import { Ionicons } from "@expo/vector-icons"
import React from "react"
import { Pressable, Text, View } from "react-native"

export type PlanConfirmationCardProps = {
  badge: string
  name: string
  description: string
  price: string
  duration: string
  onChangePlan?: () => void
}

function parseDescription(description: string) {
  const lines = description
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)

  const facilitiesIndex = lines.findIndex(
    (line) =>
      line.toLowerCase().startsWith("fasilitas") || line.toLowerCase().startsWith("facilities") || line.toLowerCase().startsWith("benefits")
  )
  const tagline = (facilitiesIndex === -1 ? lines : lines.slice(0, facilitiesIndex)).join(" ")
  const facilities = facilitiesIndex === -1 ? [] : lines.slice(facilitiesIndex + 1).map((line) => line.replace(/^-\s*/, ""))

  return { tagline, facilities }
}

export default function PlanConfirmationCard({
  badge,
  name,
  description,
  price,
  duration,
  onChangePlan
}: Readonly<PlanConfirmationCardProps>) {
  const { tagline, facilities } = parseDescription(description)

  return (
    <View className="gap-4 rounded-2xl border border-border bg-surface p-5">
      {/* Header: badge + ganti paket */}
      <View className="flex-row items-center justify-between">
        <View className="rounded-md bg-primary/15 px-3 py-1.5">
          <Text className="font-inter text-xs font-bold tracking-wider text-accent">{badge}</Text>
        </View>

        {onChangePlan ? (
          <Pressable
            onPress={onChangePlan}
            accessibilityRole="button"
            accessibilityLabel="Change plan"
            hitSlop={8}
            className="flex-row items-center gap-1 active:opacity-70"
          >
            <Ionicons
              name="swap-horizontal"
              size={16}
              color="#FF8A33"
            />
            <Text className="font-inter text-sm font-semibold text-primary-hover">Change</Text>
          </Pressable>
        ) : null}
      </View>

      {/* Nama + tagline */}
      <View className="gap-1">
        <Text className="font-inter text-2xl font-bold text-text-primary">{name}</Text>
        {tagline ? <Text className="font-inter text-sm text-text-secondary">{tagline}</Text> : null}
      </View>

      {/* Fasilitas */}
      {facilities.length > 0 ? (
        <View className="gap-3 rounded-xl border border-border bg-card p-4">
          <Text className="font-inter text-[10px] font-semibold uppercase tracking-wide text-text-subdued">What you get</Text>

          <View className="flex-row flex-wrap gap-y-2.5">
            {facilities.map((item) => (
              <View
                key={item}
                className="w-1/2 flex-row items-center gap-2 pr-2"
              >
                <Ionicons
                  name="checkmark-circle"
                  size={18}
                  color="#22C55E"
                />
                <Text
                  className="flex-1 font-inter text-sm text-text-body"
                  numberOfLines={1}
                >
                  {item}
                </Text>
              </View>
            ))}
          </View>
        </View>
      ) : null}

      {/* Rincian */}
      <View className="gap-3">
        <View className="flex-row items-center justify-between">
          <Text className="font-inter text-sm text-text-secondary">Extension period</Text>
          <Text className="font-inter text-sm font-bold text-text-primary">{duration}</Text>
        </View>

        <View className="h-px bg-border" />

        <View className="flex-row items-center justify-between">
          <Text className="font-inter text-sm font-bold text-text-primary">Plan price</Text>
          <Text className="font-inter text-2xl font-bold text-accent">{price}</Text>
        </View>
      </View>
    </View>
  )
}
