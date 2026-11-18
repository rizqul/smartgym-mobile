import HeaderNavigation from "@/components/gym/templates/headerNavigation"
import { DUMMYTRANSACTIONS } from "@/data/dummyTransaction"
import { FormatRupiah } from "@/utils/FormaterHelper"
import { Ionicons } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import React from "react"
import { ScrollView, StatusBar, Text, TouchableOpacity, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

const MOCK_DETAIL = DUMMYTRANSACTIONS[3]

export default function TransactionDetail() {
  const router = useRouter()
  const data = MOCK_DETAIL
  const isSuccess = data.status === "PAID"

  return (
    <SafeAreaView className="flex-1 bg-background">
      <StatusBar barStyle="light-content" />

      {/* HEADER */}
      <HeaderNavigation label="Detail Transaksi" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="px-5 pt-8 pb-10 gap-4 items-center"
      >
        <View className="w-full items-center justify-center">
          {/* Concentric Icon */}
          <View className={`mb-2 h-32 w-32 items-center justify-center rounded-full ${isSuccess ? "bg-primary/5" : "bg-secondary/5"}`}>
            <View className={`h-24 w-24 items-center justify-center rounded-full ${isSuccess ? "bg-primary/20" : "bg-secondary/20"}`}>
              <View
                className={`h-16 w-16 items-center justify-center rounded-full border-[3px] border-surface ${isSuccess ? "bg-primary" : "bg-secondary"}`}
              >
                <Ionicons
                  name={isSuccess ? "checkmark" : "time"}
                  size={32}
                  color="#1A1D24"
                />
              </View>
            </View>
          </View>

          {/* Watermark Text */}
          <Text className="text-center text-4xl font-extrabold text-white">
            {isSuccess ? "Pembayaran berhasil!" : "Menunggu Pembayaran"}
          </Text>
        </View>

        {/* SUBTITLE */}
        <View className="w-full rounded-2xl border border-border/50 bg-card p-5">
          <Text className={`mb-3 text-[10px] font-bold uppercase tracking-widest ${isSuccess ? "text-success" : "text-secondary"}`}>
            {data.type} • {isSuccess ? "BERHASIL" : "PENDING"}
          </Text>
          <Text className="mb-1 text-2xl font-bold text-text-primary">{data.relation_data.title}</Text>
          <Text className="mb-4 text-xs text-text-secondary">{data.relation_data.description}</Text>
          <Text className="text-3xl font-extrabold text-primary">{FormatRupiah(data.amount)}</Text>
        </View>

        <View className="w-full rounded-2xl border border-border/50 bg-card p-5">
          <Text className="mb-4 text-sm font-bold text-text-primary">Informasi transaksi</Text>

          <View className="gap-3">
            <View className="flex-row items-center justify-between">
              <Text className="text-xs text-text-secondary">ID transaksi</Text>
              <Text className="text-xs font-bold text-text-primary">{data.midtrans_order_id}</Text>
            </View>
            <View className="flex-row items-center justify-between">
              <Text className="text-xs text-text-secondary">Tanggal transaksi</Text>
              <Text className="text-xs font-bold text-text-primary">
                {new Date(data.created_at).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit"
                })}
              </Text>
            </View>
            <View className="flex-row items-center justify-between">
              <Text className="text-xs text-text-secondary">Metode pembayaran</Text>
              <Text className="text-xs font-bold text-text-primary">{data.payment_method}</Text>
            </View>
            <View className="flex-row items-center justify-between">
              <Text className="text-xs text-text-secondary">Status</Text>
              <Text className={`text-xs font-bold ${isSuccess ? "text-success" : "text-secondary"}`}>
                {isSuccess ? "Berhasil" : "Menunggu Pembayaran"}
              </Text>
            </View>
          </View>
        </View>

        <View className="w-full rounded-2xl border border-border/50 bg-card p-5">
          <Text className="mb-4 text-sm font-bold text-text-primary">Rincian pembayaran</Text>

          <View className="gap-2">
            <View className="flex-row items-center justify-between">
              <Text className="text-xs text-text-secondary">Harga paket</Text>
              <Text className="text-xs font-bold text-text-primary">{FormatRupiah(data.amount)}</Text>
            </View>
            <View className="mt-2 flex-row items-center justify-between border-t border-border/30 pt-3">
              <Text className="text-sm font-bold text-text-primary">Total pembayaran</Text>
              <Text className="text-sm font-bold text-text-primary">{FormatRupiah(data.amount)}</Text>
            </View>
          </View>
        </View>

        {isSuccess && (
          <View className="w-full rounded-2xl border border-success/20 bg-[#1A2E22] p-4">
            <Text className="mb-1 text-sm font-bold text-success">Pembayaran tercatat</Text>
            <Text className="text-xs leading-5 text-[#74C69D]">
              Gunakan Digital Pass dari menu Pass. Jangan gunakan bukti transaksi sebagai QR masuk.
            </Text>
          </View>
        )}

        <View className="w-full gap-3">
          {isSuccess ? (
            <TouchableOpacity className="w-full items-center justify-center rounded-xl bg-primary py-4">
              <Text className="text-sm font-bold text-[#111317]">Lihat Digital Pass</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              className="w-full items-center justify-center rounded-xl bg-secondary py-4"
              // onPress={() => handlePayment()}
            >
              <Text className="text-sm font-bold text-[#111317]">Bayar Sekarang</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            className="w-full items-center justify-center rounded-xl border border-border bg-surface py-4"
            onPress={() => router.back()} // Kembali ke halaman sebelumnya (History)
          >
            <Text className="text-sm font-bold text-text-primary">Kembali ke riwayat transaksi</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
