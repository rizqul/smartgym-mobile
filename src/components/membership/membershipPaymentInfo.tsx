import { MaterialIcons } from "@expo/vector-icons"
import React from "react"
import { Text, View } from "react-native"

type MethodTone = "info" | "primary" | "secondary" | "neutral"

export type PaymentMethod = {
  label: string
  tone?: MethodTone
}

type MembershipPaymentInfoProps = {
  title?: string
  provider?: string
  methods?: PaymentMethod[]
  note?: string
}

const ICON_COLORS = {
  info: "#60A5FA",
  secondary: "#FFD166",
  accent: "#FFB693"
}

const methodTextStyles: Record<MethodTone, string> = {
  info: "text-info",
  primary: "text-primary",
  secondary: "text-secondary",
  neutral: "text-text-body"
}

const defaultMethods: PaymentMethod[] = [
  { label: "GoPay", tone: "info" },
  { label: "QRIS", tone: "primary" },
  { label: "BCA", tone: "info" },
  { label: "Mandiri", tone: "secondary" },
  { label: "Visa/MC", tone: "neutral" }
]

export default function MembershipPaymentInfo({
  title = "Pembayaran Aman & Otomatis",
  provider = "Powered by Midtrans",
  methods = defaultMethods,
  note = "Membership langsung aktif seketika setelah pembayaran terverifikasi otomatis tanpa upload bukti transfer."
}: MembershipPaymentInfoProps) {
  return (
    <View className="w-full gap-4 rounded-2xl border border-border bg-surface p-5">
      {/* Title + provider */}
      <View className="flex-row items-center justify-between gap-2">
        <View className="flex-1 flex-row items-center gap-2">
          <MaterialIcons
            name="lock"
            size={20}
            color={ICON_COLORS.info}
          />
          <Text className="flex-1 text-sm font-semibold text-text-body">{title}</Text>
        </View>
        <View className="flex-row items-center gap-1">
          <MaterialIcons
            name="shield"
            size={12}
            color={ICON_COLORS.secondary}
          />
          <Text className="text-[10px] font-bold text-text-warm">{provider}</Text>
        </View>
      </View>

      {/* Payment methods */}
      <View className="flex-row flex-wrap gap-2">
        {methods.map((method) => (
          <View
            key={method.label}
            className="items-center justify-center rounded-lg bg-card px-4 py-2.5"
          >
            <Text className={`text-xs font-bold ${methodTextStyles[method.tone ?? "neutral"]}`}>{method.label}</Text>
          </View>
        ))}
      </View>

      {/* Note */}
      <View className="flex-row items-start gap-2">
        <MaterialIcons
          name="bolt"
          size={18}
          color={ICON_COLORS.secondary}
        />
        <Text className="flex-1 text-xs leading-5 text-text-warm">{note}</Text>
      </View>
    </View>
  )
}
