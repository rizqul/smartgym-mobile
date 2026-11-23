import { useState } from "react"
import { View, Text } from "react-native"
import BankList from "./bankList"
import MethodOption from "./methodOption"
import { BankId, PaymentMethodId, PaymentSectionProps } from "@/type/payment.type"
import { PAYMENT_METHODS } from "@/data/helperPayment/paymentMethods"

export default function PaymentSection({
  summary,
  selectedMethod,
  onSelectMethod,
  selectedBank,
  onSelectBank
}: Readonly<PaymentSectionProps>) {
  const [internalSelected, setInternalSelected] = useState<PaymentMethodId>("OTHER_QRIS")
  const [internalBank, setInternalBank] = useState<BankId | undefined>(undefined)
  const selected = selectedMethod ?? internalSelected
  const bank = selectedBank ?? internalBank

  const handleSelect = (id: PaymentMethodId) => {
    setInternalSelected(id)
    onSelectMethod?.(id)
  }

  const handleSelectBank = (id: BankId) => {
    setInternalBank(id)
    onSelectBank?.(id)
  }

  return (
    <View className="gap-6">
      {/* Metode pembayaran */}
      <View className="gap-3">
        <View className="flex-row items-center justify-between">
          <Text className="text-xl font-bold text-text-primary">Metode pembayaran</Text>
          <Text className="text-xs text-text-subdued">via Midtrans</Text>
        </View>

        <Text className="text-sm text-text-secondary">Pilih metode pembayaran yang kamu inginkan.</Text>

        <View
          className="gap-3"
          accessibilityRole="radiogroup"
        >
          {PAYMENT_METHODS.map((method) => (
            <View
              key={method.id}
              className="gap-2"
            >
              <MethodOption
                method={method}
                selected={selected === method.id}
                onPress={() => handleSelect(method.id)}
              />

              {method.id === "bank" && selected === "bank" ? (
                <BankList
                  selectedBank={bank}
                  onSelect={handleSelectBank}
                />
              ) : null}
            </View>
          ))}
        </View>
      </View>

      {/* Ringkasan pembayaran */}
      <View className="gap-3">
        <Text className="text-xl font-bold text-text-primary">Ringkasan pembayaran</Text>

        <View className="gap-3 rounded-2xl border border-border bg-surface p-4">
          <View className="flex-row items-center justify-between">
            <Text className="text-sm text-text-secondary">{summary.planName}</Text>
            <Text className="text-sm font-bold text-text-primary">{summary.price}</Text>
          </View>

          <View className="flex-row items-center justify-between">
            <Text className="text-sm text-text-secondary">Masa berlaku</Text>
            <Text className="text-sm font-bold text-text-primary">{summary.duration}</Text>
          </View>

          <View className="h-px bg-border" />

          <View className="flex-row items-center justify-between">
            <Text className="text-sm font-bold text-text-primary">Total pembayaran</Text>
            <Text className="text-2xl font-bold text-primary">{summary.total}</Text>
          </View>
        </View>
      </View>
    </View>
  )
}
