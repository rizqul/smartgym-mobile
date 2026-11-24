import { BANK_OPTIONS } from "@/data/helperPayment/bankOption"
import { BankId } from "@/type/payment.type"
import { Ionicons } from "@expo/vector-icons"
import { Image, Pressable, Text, View } from "react-native"

export default function BankList({ selectedBank, onSelect }: Readonly<{ selectedBank?: BankId; onSelect: (id: BankId) => void }>) {
  return (
    <View className="mx-2 gap-2 border-x-2 border-primary/40 px-2">
      <Text className="text-[10px] font-semibold uppercase tracking-wide text-text-subdued">Pilih bank</Text>

      {BANK_OPTIONS.map((bank) => {
        const isSelected = bank.id === selectedBank
        return (
          <Pressable
            key={bank.id}
            onPress={() => onSelect(bank.id)}
            accessibilityRole="radio"
            accessibilityState={{ selected: isSelected }}
            accessibilityLabel={bank.name}
            className={`flex-row items-center gap-3 rounded-xl border px-3 py-3 active:opacity-80 ${
              isSelected ? "border-primary bg-primary/10" : "border-border bg-card"
            }`}
          >
            {/* Badge inisial */}
            <View className={`h-9 w-14 items-center justify-center rounded-lg `}>
              <Image
                source={bank.image}
                className="h-full w-full rounded-md"
              />
            </View>

            <Text className={`flex-1 font-inter text-sm ${isSelected ? "font-bold text-text-primary" : "font-semibold text-text-body"}`}>
              {bank.name}
            </Text>

            <Ionicons
              name={isSelected ? "checkmark-circle" : "ellipse-outline"}
              size={22}
              color={isSelected ? "#FF6B00" : "#6B7280"}
            />
          </Pressable>
        )
      })}
    </View>
  )
}
