import { PAYMENT_METHODS } from "@/data/helperPayment/paymentMethods"
import { BankId, PaymentMethodId, PaymentSectionProps } from "@/type/payment.type"
import { useState } from "react"
import { Text, View } from "react-native"
import BankList from "./bankList"
import MethodOption from "./methodOption"

export default function PaymentSection({
  summary,
  selectedMethod,
  onSelectMethod,
  selectedBank,
  onSelectBank,
  label
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
      {/* Payment method */}
      <View className="gap-3">
        <View className="flex-row items-center justify-between">
          <Text className="font-inter text-xl font-bold text-text-primary">Payment method</Text>
          <Text className="font-inter text-sm text-text-subdued">via Midtrans</Text>
        </View>

        <Text className="font-inter text-sm text-text-secondary">Choose your preferred payment method.</Text>

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

      {/* Payment summary */}
      <View className="gap-3">
        <Text className="font-inter text-xl font-bold text-text-primary">Payment summary</Text>

        <View className="gap-3 rounded-2xl border border-border bg-surface p-4">
          <View className="flex-row items-center justify-between">
            <Text className="font-inter text-[14px] text-text-secondary">{summary.planName}</Text>
            <Text className="font-inter text-[14px] font-bold text-text-primary">{summary.price}</Text>
          </View>

          <View className="flex-row items-center justify-between">
            <Text className="font-inter text-[14px] text-text-secondary">{label}</Text>
            <Text className="font-inter text-[14px] font-bold text-text-primary">{summary.duration}</Text>
          </View>

          <View className="h-px bg-border" />

          <View className="flex-row items-center justify-between">
            <Text className="font-inter text-[14px] font-bold text-text-primary">Total payment</Text>
            <Text className="font-inter text-2xl font-bold text-primary">{summary.total}</Text>
          </View>
        </View>
      </View>
    </View>
  )
}
