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
  {
    card: string
    badge: string
    badgeText: string
    button: string
    buttonText: string
    check: string
  }
> = {
  default: {
    card: "border-border",
    badge: "bg-card",
    badgeText: "text-text-warm",
    button: "border border-border bg-card",
    buttonText: "text-text-primary",
    check: "#E2BFB0" // text.warm
  },
  popular: {
    card: "border-primary shadow-lg shadow-primary/25",
    badge: "bg-primary",
    badgeText: "text-text-primary",
    button: "bg-primary",
    buttonText: "text-text-primary",
    check: "#FF6B00" // primary
  },
  best: {
    card: "border-accent/50",
    badge: "bg-accent",
    badgeText: "text-background",
    button: "border border-accent/60 bg-accent/10",
    buttonText: "text-accent",
    check: "#FFB693" // accent
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
    <View className={`w-[370] gap-4 rounded-2xl border bg-surface p-5 ${style.card}`}>
      {/* Top row: tier + badge */}
      <View className="flex-row items-center justify-between">
        <Text className="text-text-warm text-[10px] font-bold tracking-widest">{tier}</Text>
        {badge ? (
          <View className={`rounded-full px-2.5 py-1 ${style.badge}`}>
            <Text className={`text-[10px] font-bold ${style.badgeText}`}>{badge}</Text>
          </View>
        ) : null}
      </View>

      {/* Name + description */}
      <View className="gap-1">
        <Text className="text-xl font-bold text-text-body">{name}</Text>
        <Text className="text-text-warm text-xs leading-5">{description}</Text>
      </View>

      {/* Price */}
      <View className="gap-1">
        {originalPrice || discountLabel ? (
          <View className="flex-row items-center gap-2">
            {originalPrice ? <Text className="text-xs text-text-subdued line-through">{originalPrice}</Text> : null}
            {discountLabel ? (
              <View className="rounded-md bg-primary/20 px-1.5 py-0.5">
                <Text className="text-accent text-[10px] font-bold">{discountLabel}</Text>
              </View>
            ) : null}
          </View>
        ) : null}
        <View className="flex-row items-end gap-1">
          <Text className="text-3xl font-bold text-text-body">{price}</Text>
          <Text className="text-text-warm pb-1 text-xs">{period}</Text>
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
            <Text className="text-text-warm flex-1 text-xs leading-5">{feature}</Text>
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
