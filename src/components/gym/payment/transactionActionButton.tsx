import { ActivityIndicator, Text, TouchableOpacity } from "react-native"

const VARIANTS = {
  primary: { box: "bg-primary", text: "text-[#111317]", spinner: "#111317" },
  secondary: { box: "bg-secondary", text: "text-[#111317]", spinner: "#111317" },
  outline: { box: "border border-border bg-surface", text: "text-text-primary", spinner: "#FFFFFF" },
  danger: { box: "border border-danger/40 bg-danger/10", text: "text-danger", spinner: "#EF4444" }
}
export const TransactionActionButton = ({
  label,
  variant,
  onPress,
  loading = false,
  disabled = false
}: {
  label: string
  variant: keyof typeof VARIANTS
  onPress: () => void
  loading?: boolean
  disabled?: boolean
}) => {
  const style = VARIANTS[variant]
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      disabled={disabled || loading}
      className={`w-full flex-row items-center justify-center gap-2 rounded-xl py-4 ${style.box} ${disabled ? "opacity-50" : ""}`}
    >
      {loading ? <ActivityIndicator color={style.spinner} /> : null}
      <Text className={`text-sm font-bold ${style.text}`}>{label}</Text>
    </TouchableOpacity>
  )
}
