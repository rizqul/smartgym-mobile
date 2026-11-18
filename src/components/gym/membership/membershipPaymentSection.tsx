import React, { useState } from "react"
import { Pressable, Text, View } from "react-native"

export type PaymentMethodId = "qris" | "bank" | "ewallet" | "card" | "retail"

type PaymentMethod = {
  id: PaymentMethodId
  tile: string
  title: string
  description: string
}

const PAYMENT_METHODS: PaymentMethod[] = [
  { id: "qris", tile: "QRIS", title: "QRIS", description: "Scan dengan aplikasi bank atau e-wallet" },
  { id: "bank", tile: "BANK", title: "Transfer bank / Virtual Account", description: "BCA, BNI, BRI, Mandiri, dan bank lainnya" },
  { id: "ewallet", tile: "PAY", title: "E-wallet", description: "GoPay • ShopeePay" },
  { id: "card", tile: "CARD", title: "Kartu kredit / debit", description: "Visa • Mastercard • JCB • American Express" },
  { id: "retail", tile: "TOKO", title: "Gerai retail", description: "Alfamart • Indomaret" }
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

export default function PaymentSection({ summary, selectedMethod, onSelectMethod }: PaymentSectionProps) {
  const [internalSelected, setInternalSelected] = useState<PaymentMethodId>("qris")
  const selected = selectedMethod ?? internalSelected

  const handleSelect = (id: PaymentMethodId) => {
    setInternalSelected(id)
    onSelectMethod?.(id)
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
            <MethodOption
              key={method.id}
              method={method}
              selected={selected === method.id}
              onPress={() => handleSelect(method.id)}
            />
          ))}
        </View>

        <Text className="text-xs text-text-subdued">Metode yang tersedia mengikuti pengaturan merchant di Midtrans.</Text>
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
