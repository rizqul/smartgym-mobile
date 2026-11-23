import { PaymentMethod } from "@/type/payment.type"
import { Image, Pressable, Text, View } from "react-native"

export default function MethodOption({
  method,
  selected,
  onPress
}: Readonly<{ method: PaymentMethod; selected: boolean; onPress: () => void }>) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      accessibilityLabel={method.title}
      className={`flex-row items-center gap-3 rounded-xl border px-3 py-3.5 active:opacity-80 ${
        selected ? "border-primary bg-primary/10" : "border-border bg-surface"
      }`}
    >
      {/* Tile label */}
      <View className={`h-14 w-14 items-center justify-center rounded-lg ${selected ? "bg-accent" : "bg-text-body"}`}>
        <Image
          source={method.tile}
          className="h-full w-full rounded-md"
        />
      </View>

      {/* Title + description */}
      <View className="flex-1 gap-0.5">
        <Text className="text-sm font-bold text-text-primary">{method.title}</Text>
        <Text className="text-xs text-text-subdued">{method.description}</Text>
      </View>

      {/* Radio */}
      <View className={`h-6 w-6 items-center justify-center rounded-full border-2 ${selected ? "border-primary" : "border-text-muted"}`}>
        {selected ? <View className="h-3 w-3 rounded-full bg-primary" /> : null}
      </View>
    </Pressable>
  )
}
