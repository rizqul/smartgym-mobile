import { MaterialIcons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"
import React from "react"
import { Text, View } from "react-native"

type MethodTone = "info" | "primary" | "secondary" | "neutral" | "success" | "danger"
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
  success: "#22C55E",
  danger: "#EF4444"
}

const DEFAULT_METHODS: PaymentMethod[] = []

const methodStyles: Record<MethodTone, { chip: string; text: string }> = {
  info: { chip: "border-info/30 bg-info/10", text: "text-info" },
  primary: { chip: "border-primary/30 bg-primary/10", text: "text-primary-hover" },
  secondary: { chip: "border-secondary/30 bg-secondary/10", text: "text-secondary" },
  success: { chip: "border-success/30 bg-success/10", text: "text-success" },
  danger: { chip: "border-danger/30 bg-danger/10", text: "text-danger" },
  neutral: { chip: "border-border bg-card", text: "text-text-body" }
}

export default function MembershipPaymentInfo({
  title = "Pembayaran Aman & Otomatis",
  provider = "Powered by Midtrans",
  methods = DEFAULT_METHODS,
  note = "Membership langsung aktif seketika setelah pembayaran terverifikasi otomatis tanpa upload bukti transfer."
}: Readonly<MembershipPaymentInfoProps>) {
  return (
    <View className="w-full overflow-hidden rounded-2xl border border-info/25">
      <LinearGradient
        colors={["#1D3A66", "#16233A", "#1A1D24"]}
        locations={[0, 0.55, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ padding: 20, gap: 16 }}
      >
        {/* Glow dekoratif */}
        <View
          pointerEvents="none"
          className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-info/15"
        />

        {/* Title + provider */}
        <View className="flex-row items-center justify-between gap-2">
          <View className="flex-1 flex-row items-center gap-3">
            <View className="h-10 w-10 items-center justify-center rounded-xl border border-info/30 bg-info/15">
              <MaterialIcons
                name="lock"
                size={20}
                color={ICON_COLORS.info}
              />
            </View>
            <Text className="flex-1 text-sm font-bold text-text-primary">{title}</Text>
          </View>
        </View>

        {/* Provider pill */}
        <View className="flex-row items-center gap-1.5 self-start rounded-full border border-secondary/30 bg-secondary/10 px-3 py-1.5">
          <MaterialIcons
            name="verified-user"
            size={12}
            color={ICON_COLORS.secondary}
          />
          <Text className="text-[10px] font-bold tracking-wide text-secondary">{provider}</Text>
        </View>

        {/* Payment methods */}
        <View className="w-[280px] flex-row flex-wrap gap-2">
          {methods.map((method) => {
            const tone = methodStyles[method.tone ?? "neutral"]
            return (
              <View
                key={method.label}
                className={`items-center justify-center rounded-lg border px-3.5 py-2 ${tone.chip}`}
              >
                <Text className={`text-xs font-bold ${tone.text}`}>{method.label}</Text>
              </View>
            )
          })}
        </View>

        {/* Divider */}
        <View className="h-px bg-white/10" />

        {/* Note */}
        <View className="flex-row items-start gap-3">
          <View className="h-7 w-7 items-center justify-center rounded-full bg-secondary/15">
            <MaterialIcons
              name="bolt"
              size={16}
              color={ICON_COLORS.secondary}
            />
          </View>
          <Text className="flex-1 text-xs leading-5 text-text-secondary">{note}</Text>
        </View>
      </LinearGradient>
    </View>
  )
}
