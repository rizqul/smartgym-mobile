import { Ionicons } from "@expo/vector-icons"
import React, { useState } from "react"
import { Pressable, Text, View } from "react-native"

export type PaymentMethodId = "OTHER_QRIS" | "bank" | "ECHANNEL" | "GOPAY" | "DANA" | "SHOPEEPAY"
export type BankId = "BCA_VA" | "BNI_VA" | "BSI_VA" | "BRI_VA" | "SEABANK_VA"

type PaymentMethod = {
  id: PaymentMethodId
  tile: string
  title: string
  description: string
}

type BankOption = {
  id: BankId
  name: string
}

export const PAYMENT_METHODS: PaymentMethod[] = [
  { id: "OTHER_QRIS", tile: "QRIS", title: "QRIS", description: "Scan dengan aplikasi bank atau e-wallet" },
  { id: "bank", tile: "BANK", title: "Transfer bank / Virtual Account", description: "BNI, BSI, BRI, dan SeaBank" },
  { id: "ECHANNEL", tile: "ECHANNEL", title: "ECHANNEL", description: "ECHANNEL" },
  { id: "GOPAY", tile: "CARD", title: "GOPAY", description: "GOPAY" },
  { id: "DANA", tile: "TOKO", title: "Gerai retail", description: "Alfamart • Indomaret" },
  { id: "SHOPEEPAY", tile: "TOKO", title: "Gerai retail", description: "Alfamart • Indomaret" }
]

export const BANK_OPTIONS: BankOption[] = [
  { id: "BCA_VA", name: "BCA" },
  { id: "BNI_VA", name: "BNI" },
  { id: "BSI_VA", name: "BSI" },
  { id: "BRI_VA", name: "BRI" },
  { id: "SEABANK_VA", name: "SeaBank" }
]

export type PaymentSummary = {
  planName: string
  price: string
  duration: string
  total: string
}

export type PaymentSectionProps = {
  summary: PaymentSummary
  selectedMethod?: PaymentMethodId
  onSelectMethod?: (id: PaymentMethodId) => void
  selectedBank?: BankId
  onSelectBank?: (id: BankId) => void
}

function MethodOption({ method, selected, onPress }: { method: PaymentMethod; selected: boolean; onPress: () => void }) {
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
      <View className={`h-9 w-14 items-center justify-center rounded-lg ${selected ? "bg-accent" : "bg-text-body"}`}>
        <Text className="text-[10px] font-bold text-background">{method.tile}</Text>
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

function BankDropdown({
  selectedBank,
  open,
  onToggle,
  onSelect
}: {
  selectedBank?: BankId
  open: boolean
  onToggle: () => void
  onSelect: (id: BankId) => void
}) {
  const selected = BANK_OPTIONS.find((b) => b.id === selectedBank)

  return (
    <View className="gap-2">
      {/* Trigger */}
      <Pressable
        onPress={onToggle}
        accessibilityRole="button"
        accessibilityLabel="Pilih bank"
        accessibilityState={{ expanded: open }}
        className={`flex-row items-center justify-between rounded-xl border bg-surface px-4 py-3.5 active:opacity-80 ${
          open ? "border-primary" : "border-border"
        }`}
      >
        <View className="gap-0.5">
          <Text className="text-[10px] font-semibold uppercase tracking-wide text-text-subdued">Bank</Text>
          <Text className={`text-sm ${selected ? "font-bold text-text-primary" : "text-text-muted"}`}>
            {selected ? selected.name : "Pilih bank"}
          </Text>
        </View>
        <Ionicons
          name={open ? "chevron-up" : "chevron-down"}
          size={20}
          color="#B8BDC7"
        />
      </Pressable>

      {/* List */}
      {open ? (
        <View className="overflow-hidden rounded-xl border border-border bg-surface">
          {BANK_OPTIONS.map((bank, index) => {
            const isSelected = bank.id === selectedBank
            return (
              <Pressable
                key={bank.id}
                onPress={() => onSelect(bank.id)}
                accessibilityRole="radio"
                accessibilityState={{ selected: isSelected }}
                accessibilityLabel={bank.name}
                className={`flex-row items-center justify-between px-4 py-3.5 active:opacity-80 ${
                  index !== BANK_OPTIONS.length - 1 ? "border-b border-border" : ""
                } ${isSelected ? "bg-primary/10" : ""}`}
              >
                <Text className={`text-sm ${isSelected ? "font-bold text-primary" : "font-semibold text-text-primary"}`}>{bank.name}</Text>
                {isSelected ? (
                  <Ionicons
                    name="checkmark-circle"
                    size={20}
                    color="#FF6B00"
                  />
                ) : null}
              </Pressable>
            )
          })}
        </View>
      ) : null}
    </View>
  )
}

export default function PaymentSection({ summary, selectedMethod, onSelectMethod, selectedBank, onSelectBank }: PaymentSectionProps) {
  const [internalSelected, setInternalSelected] = useState<PaymentMethodId>("OTHER_QRIS")
  const [internalBank, setInternalBank] = useState<BankId | undefined>(undefined)
  const [bankOpen, setBankOpen] = useState(false)
  const selected = selectedMethod ?? internalSelected
  const bank = selectedBank ?? internalBank

  const handleSelect = (id: PaymentMethodId) => {
    setInternalSelected(id)
    onSelectMethod?.(id)
    setBankOpen(id === "bank")
  }

  const handleSelectBank = (id: BankId) => {
    setInternalBank(id)
    onSelectBank?.(id)
    setBankOpen(false)
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
                <BankDropdown
                  selectedBank={bank}
                  open={bankOpen}
                  onToggle={() => setBankOpen((prev) => !prev)}
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
