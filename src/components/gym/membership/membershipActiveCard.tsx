import { MaterialIcons } from "@expo/vector-icons"
import React from "react"
import { Pressable, Text, View } from "react-native"

type IconName = React.ComponentProps<typeof MaterialIcons>["name"]

type BenefitTone = "primary" | "info"

type MembershipStatus = "none" | "active" | "expired"

export type MembershipBenefit = {
  icon: IconName
  title: string
  description: string
  tone?: BenefitTone
}

export type MembershipCardProps = {
  /** Straight from User.membershipExpiredAt (ISO string or null) */
  membershipExpiredAt: string | null
  onActionPress?: () => void
}

const ICON_COLORS = {
  primary: "#FF6B00",
  info: "#60A5FA",
  highlight: "#FDE047",
  danger: "#F87171",
  muted: "#9CA3AF"
}

const toneStyles: Record<BenefitTone, { box: string; icon: string }> = {
  primary: { box: "bg-primary/15", icon: ICON_COLORS.primary },
  info: { box: "bg-info/15", icon: ICON_COLORS.info }
}

const BENEFITS: MembershipBenefit[] = [
  {
    icon: "fitness-center",
    title: "Personal Trainer Booking",
    description: "Book one-on-one sessions with a personal trainer",
    tone: "primary"
  },
  {
    icon: "smart-toy",
    title: "AI Workout Advice",
    description: "Get smart training suggestions based on your goals",
    tone: "info"
  },
  {
    icon: "qr-code-scanner",
    title: "QR Check-in & Gym Time Tracking",
    description: "Scan at the lobby and track your visits",
    tone: "primary"
  }
]

const STATUS_CONTENT: Record<
  MembershipStatus,
  {
    badge: string
    badgeIcon: IconName
    title: string
    subtitle: string
    benefitsLabel: string
    buttonLabel: string
  }
> = {
  none: {
    badge: "NO MEMBERSHIP YET",
    badgeIcon: "lock-outline",
    title: "Unlock Your Full Gym Experience",
    subtitle: "Every membership includes all the benefits below. A plan only sets how long your access lasts.",
    benefitsLabel: "WHAT YOU GET",
    buttonLabel: "Get Membership"
  },
  active: {
    badge: "ACTIVE MEMBERSHIP",
    badgeIcon: "workspace-premium",
    title: "You're All Set!",
    subtitle: "Your membership is active. Enjoy every benefit below.",
    benefitsLabel: "YOUR ACTIVE BENEFITS",
    buttonLabel: "Extend Membership"
  },
  expired: {
    badge: "MEMBERSHIP EXPIRED",
    badgeIcon: "error-outline",
    title: "Your Membership Has Expired",
    subtitle: "Renew now to get these benefits back. Your workout history is safe and waiting for you.",
    benefitsLabel: "BENEFITS YOU'RE MISSING",
    buttonLabel: "Renew Membership"
  }
}

function getStatus(expiredAt: string | null): MembershipStatus {
  if (!expiredAt) return "none"
  const time = new Date(expiredAt).getTime()
  if (Number.isNaN(time)) return "none"
  return time > Date.now() ? "active" : "expired"
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  })
}

function getDaysLeft(iso: string) {
  const diff = new Date(iso).getTime() - Date.now()
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
}

export default function MembershipActiveCard({ membershipExpiredAt, onActionPress }: Readonly<MembershipCardProps>) {
  const status = getStatus(membershipExpiredAt)
  const content = STATUS_CONTENT[status]

  const isActive = status === "active"
  const isExpired = status === "expired"

  const badgeColor = isExpired ? ICON_COLORS.danger : isActive ? ICON_COLORS.highlight : ICON_COLORS.muted
  const badgeBox = isExpired
    ? "border-red-400/30 bg-red-400/15"
    : isActive
      ? "border-highlight/30 bg-highlight/15"
      : "border-border bg-card"
  const badgeText = isExpired ? "text-red-400" : isActive ? "text-highlight" : "text-text-warm"

  const daysLeft = isActive && membershipExpiredAt ? getDaysLeft(membershipExpiredAt) : 0

  return (
    <View className="gap-5 rounded-3xl border border-border bg-surface p-5">
      {/* Top row: status badge */}
      <View className="flex-row items-center justify-between">
        <View className={`flex-row items-center gap-1.5 rounded-full border px-3 py-1.5 ${badgeBox}`}>
          <MaterialIcons
            name={content.badgeIcon}
            size={14}
            color={badgeColor}
          />
          <Text className={`text-[10px] font-bold tracking-wider ${badgeText}`}>{content.badge}</Text>
        </View>
        {isActive && (
          <View className="rounded-full bg-card px-3 py-1.5">
            <Text className="text-[11px] font-semibold text-text-warm">
              {daysLeft} {daysLeft === 1 ? "day" : "days"} left
            </Text>
          </View>
        )}
      </View>

      {/* Title + subtitle + date */}
      <View className="gap-2">
        <Text className="text-2xl font-bold text-text-primary">{content.title}</Text>
        <Text className="text-xs leading-5 text-text-warm">{content.subtitle}</Text>
        {membershipExpiredAt && (
          <View className="mt-1 flex-row items-center gap-2">
            <MaterialIcons
              name={isExpired ? "event-busy" : "event-available"}
              size={16}
              color={isExpired ? ICON_COLORS.danger : ICON_COLORS.highlight}
            />
            <Text className="text-xs text-text-warm">
              {isExpired ? "Expired on " : "Active until "}
              <Text className="font-bold text-text-primary">{formatDate(membershipExpiredAt)}</Text>
            </Text>
          </View>
        )}
      </View>

      {/* Benefits */}
      <View className="gap-3">
        <Text className="text-[10px] font-bold tracking-widest text-text-warm">{content.benefitsLabel}</Text>
        {BENEFITS.map((benefit) => {
          const tone = toneStyles[benefit.tone ?? "primary"]
          return (
            <View
              key={benefit.title}
              className={`flex-row items-center gap-3 rounded-xl border border-border bg-background p-3 ${isActive ? "" : "opacity-60"}`}
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
                name={isActive ? "check-circle" : "lock"}
                size={20}
                color={isActive ? ICON_COLORS.highlight : ICON_COLORS.muted}
              />
            </View>
          )
        })}
      </View>

      {/* Action button */}
      <Pressable
        onPress={onActionPress}
        className="items-center justify-center rounded-xl bg-primary py-4 active:bg-primary-hover"
        accessibilityRole="button"
        accessibilityLabel={content.buttonLabel}
      >
        <Text className="text-sm font-bold text-text-primary">{content.buttonLabel}</Text>
      </Pressable>
    </View>
  )
}
