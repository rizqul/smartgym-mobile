import { MaterialIcons } from "@expo/vector-icons"
import React from "react"
import { Pressable, Text, View } from "react-native"

type PlanVariant = "default" | "popular" | "best"

export type PlanCardProps = {
  tier: string
  name: string
  description: string
  price: string
  period: string
  originalPrice?: string
  discountLabel?: string
  badge?: string
  features: string[]
  buttonLabel: string
  onPress?: () => void
  variant?: PlanVariant
}

const variantStyles: Record<
  PlanVariant,
  { card: string; badge: string; badgeText: string; button: string; buttonText: string; check: string }
> = {
  default: {
    card: "border-white/10",
    badge: "bg-white/10",
    badgeText: "text-[#E2BFB0]",
    button: "border border-white/20 bg-white/5",
    buttonText: "text-white",
    check: "#E2BFB0"
  },
  popular: {
    card: "border-[#FF6B00]",
    badge: "bg-[#FF6B00]",
    badgeText: "text-white",
    button: "bg-[#FF6B00]",
    buttonText: "text-white",
    check: "#FF6B00"
  },
  best: {
    card: "border-[#FFB693]/50",
    badge: "bg-[#FFB693]",
    badgeText: "text-[#121215]",
    button: "border border-[#FFB693]/60 bg-[#FFB693]/10",
    buttonText: "text-[#FFB693]",
    check: "#FFB693"
  }
}

export default function PlanCard({
  tier,
  name,
  description,
  price,
  period,
  originalPrice,
  discountLabel,
  badge,
  features,
  buttonLabel,
  onPress,
  variant = "default"
}: PlanCardProps) {
  const style = variantStyles[variant]

  return (
    <View
      className={`w-full gap-4 rounded-2xl border bg-white/5 p-5 ${style.card}`}
      style={
        variant === "popular"
          ? { shadowColor: "#FF6B00", shadowOpacity: 0.25, shadowRadius: 16, shadowOffset: { width: 0, height: 4 }, elevation: 6 }
          : undefined
      }
    >
      {/* Top row: tier + badge */}
      <View className="flex-row items-center justify-between">
        <Text className="text-[10px] font-bold tracking-widest text-[#E2BFB0]">{tier}</Text>
        {badge ? (
          <View className={`rounded-full px-2.5 py-1 ${style.badge}`}>
            <Text className={`text-[10px] font-bold ${style.badgeText}`}>{badge}</Text>
          </View>
        ) : null}
      </View>

      {/* Name + description */}
      <View className="gap-1">
        <Text className="text-xl font-bold text-text-body">{name}</Text>
        <Text className="text-xs leading-5 text-[#E2BFB0]">{description}</Text>
      </View>

      {/* Price */}
      <View className="gap-1">
        {originalPrice || discountLabel ? (
          <View className="flex-row items-center gap-2">
            {originalPrice ? <Text className="text-xs text-[#8A8A90] line-through">{originalPrice}</Text> : null}
            {discountLabel ? (
              <View className="rounded-md bg-[#FF6B00]/20 px-1.5 py-0.5">
                <Text className="text-[10px] font-bold text-[#FFB693]">{discountLabel}</Text>
              </View>
            ) : null}
          </View>
        ) : null}
        <View className="flex-row items-end gap-1">
          <Text className="text-3xl font-bold text-text-body">{price}</Text>
          <Text className="pb-1 text-xs text-[#E2BFB0]">{period}</Text>
        </View>
      </View>

      {/* Features */}
      <View className="gap-2.5">
        {features.map((feature) => (
          <View
            key={feature}
            className="flex-row items-start gap-2"
          >
            <MaterialIcons
              name="check-circle"
              size={16}
              color={style.check}
            />
            <Text className="flex-1 text-xs leading-5 text-[#E2BFB0]">{feature}</Text>
          </View>
        ))}
      </View>

      {/* Button */}
      <Pressable
        onPress={onPress}
        className={`items-center justify-center rounded-xl py-3.5 active:opacity-80 ${style.button}`}
        accessibilityRole="button"
        accessibilityLabel={buttonLabel}
      >
        <Text className={`text-sm font-bold ${style.buttonText}`}>{buttonLabel}</Text>
      </Pressable>
    </View>
  )
}
