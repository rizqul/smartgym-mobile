import { MaterialIcons } from "@expo/vector-icons"
import React from "react"
import { Pressable, Text, View } from "react-native"

type IconName = React.ComponentProps<typeof MaterialIcons>["name"]

type BenefitTone = "primary" | "info"

export type MembershipBenefit = {
  icon: IconName
  title: string
  description: string
  tone?: BenefitTone
}

export type MembershipActiveCardProps = {
  planName: string
  billingLabel: string
  memberTier: string
  validUntil: string
  startDate?: string
  daysUsed?: number
  totalDays?: number
  autoRenew: boolean
  benefits: MembershipBenefit[]
  onRenewPress?: () => void
}

const ICON_COLORS = {
  primary: "#FF6B00",
  info: "#60A5FA",
  highlight: "#FDE047"
}

const toneStyles: Record<BenefitTone, { box: string; icon: string }> = {
  primary: { box: "bg-primary/15", icon: ICON_COLORS.primary },
  info: { box: "bg-info/15", icon: ICON_COLORS.info }
}

export default function MembershipActiveCard({
  planName,
  billingLabel,
  memberTier,
  validUntil,
  startDate,
  daysUsed,
  totalDays,
  autoRenew,
  benefits,
  onRenewPress
}: Readonly<MembershipActiveCardProps>) {
  return (
    <View className="gap-5 rounded-3xl border border-border bg-surface p-5">
      {/* Top row: current plan badge + member tier */}
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-1.5 rounded-full border border-highlight/30 bg-highlight/15 px-3 py-1.5">
          <MaterialIcons
            name="workspace-premium"
            size={14}
            color={ICON_COLORS.highlight}
          />
          <Text className="text-[10px] font-bold tracking-wider text-highlight">CURRENT ACTIVE PLAN</Text>
        </View>
        <View className="flex-row items-center gap-1.5 rounded-full bg-card px-3 py-1.5">
          <MaterialIcons
            name="star"
            size={12}
            color={ICON_COLORS.highlight}
          />
          <Text className="text-[11px] font-semibold text-text-warm">{memberTier}</Text>
        </View>
      </View>

      {/* Plan name + valid until */}
      <View className="gap-2">
        <View className="flex-row items-center justify-between">
          <Text className="flex-1 text-2xl font-bold text-text-primary">{planName}</Text>
          <View className="rounded-md bg-card px-2.5 py-1">
            <Text className="text-[10px] font-bold tracking-wider text-text-warm">{billingLabel}</Text>
          </View>
        </View>
        <View className="flex-row items-center gap-2">
          <MaterialIcons
            name="event-available"
            size={16}
            color={ICON_COLORS.highlight}
          />
          <Text className="text-xs text-text-warm">
            Aktif s/d <Text className="font-bold text-text-primary">{validUntil}</Text>
          </Text>
        </View>
      </View>

      {/* Benefits */}
      <View className="gap-3">
        <Text className="text-[10px] font-bold tracking-widest text-text-warm">KEUNTUNGAN AKTIF TERPASANG</Text>
        {benefits.map((benefit) => {
          const tone = toneStyles[benefit.tone ?? "primary"]
          return (
            <View
              key={benefit.title}
              className="flex-row items-center gap-3 rounded-xl border border-border bg-background p-3"
            >
              <View className={`h-10 w-10 items-center justify-center rounded-lg ${tone.box}`}>
                <MaterialIcons
                  name={benefit.icon}
                  size={20}
                  color={tone.icon}
                />
              </View>
              <View className="flex-1 gap-0.5">
                <Text className="text-sm font-semibold text-text-body">{benefit.title}</Text>
                <Text className="text-xs text-text-warm">{benefit.description}</Text>
              </View>
              <MaterialIcons
                name="check-circle"
                size={20}
                color={ICON_COLORS.highlight}
              />
            </View>
          )
        })}
      </View>

      {/* Renew button */}
      <Pressable
        onPress={onRenewPress}
        className="items-center justify-center rounded-xl bg-primary py-4 active:bg-primary-hover"
        accessibilityRole="button"
        accessibilityLabel="Perpanjang Sekarang"
      >
        <Text className="text-sm font-bold text-text-primary">Perpanjang Sekarang</Text>
      </Pressable>
    </View>
  )
}
