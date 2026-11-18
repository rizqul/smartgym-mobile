import { LinearGradient } from "expo-linear-gradient"
import React from "react"
import { Pressable, Text, View } from "react-native"

type PlanVariant = "default" | "popular"

export type PlanCardProps = {
  badge: string
  status?: string
  name: string
  description: string
  price: string
  duration: string
  buttonLabel: string
  onPress?: () => void
  variant?: PlanVariant
}

const variantStyles: Record<
  PlanVariant,
  {
    card: string
    gradient: [string, string]
    button: string
    buttonText: string
  }
> = {
  default: {
    card: "border-white/10",
    gradient: ["#2A2A2E", "#1B1F2A"],
    button: "border border-primary/40 bg-primary/10",
    buttonText: "text-accent"
  },
  popular: {
    card: "border-primary/70",
    gradient: ["#4A2F22", "#1B1F2A"],
    button: "bg-primary",
    buttonText: "text-background"
  }
}

export default function PlanCard({
  badge,
  status,
  name,
  description,
  price,
  duration,
  buttonLabel,
  onPress,
  variant = "default"
}: PlanCardProps) {
  const style = variantStyles[variant]

  return (
    <View className={`w-full overflow-hidden rounded-2xl border ${style.card}`}>
      <LinearGradient
        colors={style.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ padding: 20, gap: 16 }}
      >
        {/* Top row: badge + status */}
        <View className="flex-row items-center justify-between">
          <View className="rounded-md bg-primary/15 px-3 py-1.5">
            <Text className="text-xs font-bold tracking-wider text-accent">{badge}</Text>
          </View>
          {status ? <Text className="text-sm font-semibold text-emerald-300">{status}</Text> : null}
        </View>

        {/* Name + description */}
        <View className="gap-2">
          <Text className="text-3xl font-bold text-text-body">{name}</Text>
          <Text className="text-base leading-6 text-text-warm">{description}</Text>
        </View>

        {/* Divider */}
        <View className="h-px bg-white/10" />

        {/* Price + duration */}
        <View className="flex-row items-end justify-between">
          <View className="gap-1">
            <Text className="text-sm text-text-warm">Harga paket</Text>
            <Text className="text-4xl font-bold text-accent">{price}</Text>
          </View>
          <View className="items-end gap-1">
            <Text className="text-sm text-text-warm">Masa berlaku</Text>
            <Text className="text-xl font-bold text-text-body">{duration}</Text>
          </View>
        </View>

        {/* Button */}
        <Pressable
          onPress={onPress}
          className={`items-center justify-center rounded-xl py-4 active:opacity-80 ${style.button}`}
          accessibilityRole="button"
          accessibilityLabel={buttonLabel}
        >
          <Text className={`text-base font-bold ${style.buttonText}`}>{buttonLabel}</Text>
        </Pressable>
      </LinearGradient>
    </View>
  )
}
