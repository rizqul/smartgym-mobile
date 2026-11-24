import { Text, View } from "react-native"

export function TransactionInfoRow({
  label,
  value,
  valueClassName = "text-text-primary"
}: Readonly<{ label: string; value: string; valueClassName?: string }>) {
  return (
    <View className="flex-row items-center justify-between">
      <Text className="text-xs text-text-secondary">{label}</Text>
      <Text className={`text-xs font-bold ${valueClassName}`}>{value.replace("_", " ")}</Text>
    </View>
  )
}
