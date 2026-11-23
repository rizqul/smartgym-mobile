import PaymentSection from "@/components/gym/payment/paymentSection"
import HeaderNavigation from "@/components/gym/templates/headerNavigation"
import { bookingTrainer } from "@/service/trainer.service"
import { BankId, PaymentMethodId } from "@/type/payment.type"
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons"
import { useLocalSearchParams, useRouter } from "expo-router"
import React, { useState } from "react"
import { Image, ScrollView, StatusBar, Text, TouchableOpacity, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

export default function BookingConfirm() {
  const router = useRouter()
  const { trainerId, slotId } = useLocalSearchParams<{ trainerId: string; slotId: string }>()
  const [isChecked, setIsChecked] = useState(false)
  const [paymentId, setPaymentId] = useState<PaymentMethodId | "">("OTHER_QRIS")
  const [bankId, setBankId] = useState<BankId | "">("")

  const handleConfirm = async () => {
    try {
      const paymentType = paymentId !== "" ? paymentId : bankId
      const data = await bookingTrainer(slotId, paymentType)
      const { redirectUrl } = data
      router.push({
        pathname: "/(gym)/dashboard/paymentScreen",
        params: { paymentUrl: redirectUrl, type: "pt-booking" }
      })
    } catch (err: any) {
      console.log(err.response?.status, err.response?.data)
    }
  }

  const handleRescedule = () => {
    router.push("/trainer/trainerProfil")
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <StatusBar barStyle="light-content" />

      {/* HEADER */}
      <HeaderNavigation label="Konfirmasi Pemesanan" />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="px-5 pb-44 pt-4">
          {/* TRAINER CARD */}
          <View className="mb-6 flex-row items-center rounded-2xl border border-border/50 bg-surface p-3">
            <Image
              source={{ uri: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=150&auto=format&fit=crop" }}
              className="mr-3 h-14 w-14 rounded-xl"
            />
            <View className="flex-1">
              <Text className="mb-0.5 text-sm font-bold text-text-primary">Coach Rio Pratama, CSCS</Text>
              <Text className="mb-1 text-[11px] text-text-secondary">Senior Strength Coach</Text>
              <View className="flex-row items-center gap-3">
                <View className="flex-row items-center gap-1">
                  <Ionicons
                    name="star"
                    size={10}
                    color="#FFD166"
                  />
                  <Text className="text-[10px] font-bold text-text-primary">4.9 (142)</Text>
                </View>
                <Text className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-bold text-primary">Pro Certified</Text>
              </View>
            </View>
          </View>
          {/* RINGKASAN SESI */}
          <View className="mb-6 rounded-2xl border border-border/50 bg-card p-4">
            <View className="mb-4 flex-row items-center justify-between">
              <View className="flex-row items-center gap-2">
                <Ionicons
                  name="calendar-clear-outline"
                  size={18}
                  color="#FF6B00"
                />
                <Text className="text-sm font-bold text-text-primary">Ringkasan Sesi</Text>
              </View>
              <View className="flex-row items-center gap-1 rounded-md bg-secondary/15 px-2 py-1">
                <View className="h-1.5 w-1.5 rounded-full bg-secondary" />
                <Text className="text-[10px] font-bold text-secondary">Menunggu Konfirmasi</Text>
              </View>
            </View>

            <View className="gap-4">
              {/* Tanggal */}
              <View className="flex-row gap-3">
                <Ionicons
                  name="calendar-outline"
                  size={16}
                  color="#B8BDC7"
                  className="mt-0.5"
                />
                <View>
                  <Text className="mb-0.5 text-[10px] font-bold text-text-secondary">TANGGAL & WAKTU</Text>
                  <Text className="mb-1 text-xs font-semibold text-text-primary">Selasa, 28 Mei 2024</Text>
                  <Text className="text-[11px] text-text-secondary">08.00 - 09.00 WIB (Pagi) • 60 Menit</Text>
                </View>
              </View>

              {/* Lokasi */}
              <View className="flex-row gap-3">
                <Ionicons
                  name="location-outline"
                  size={16}
                  color="#B8BDC7"
                  className="mt-0.5"
                />
                <View>
                  <Text className="mb-0.5 text-[10px] font-bold text-text-secondary">LOKASI FASILITAS</Text>
                  <Text className="mb-1 text-xs font-semibold text-text-primary">SmartGym Central Base - Kuningan</Text>
                  <Text className="text-[11px] text-text-secondary">Zone 2: Main Strength & Biomechanics Area</Text>
                </View>
              </View>

              {/* Modul Program */}
              <View className="flex-row gap-3">
                <MaterialCommunityIcons
                  name="arm-flex"
                  size={16}
                  color="#B8BDC7"
                  className="mt-0.5"
                />
                <View>
                  <Text className="mb-0.5 text-[10px] font-bold text-text-secondary">MODUL PROGRAM</Text>
                  <Text className="mb-1 text-xs font-semibold text-text-primary">1-on-1 Hyperthrophy & Biomechanics Form Check</Text>
                  <Text className="text-[11px] text-text-secondary">Termasuk analisa kinetic bar path & mobility screening</Text>
                </View>
              </View>

              {/* Voucher */}
              <View className="flex-row items-start justify-between">
                <View className="flex-row gap-3">
                  <MaterialCommunityIcons
                    name="ticket-confirmation-outline"
                    size={16}
                    color="#B8BDC7"
                    className="mt-0.5"
                  />
                  <View>
                    <Text className="mb-0.5 text-[10px] font-bold text-text-secondary">METODE KUPON</Text>
                    <Text className="mb-1 text-xs font-semibold text-text-primary">Free Pro PT Session Voucher</Text>
                    <Text className="text-[11px] text-text-secondary">Sisa saldo benefit: 1 dari 4 kupon aktif</Text>
                  </View>
                </View>
                <Text className="text-xs font-bold text-text-primary">Rp 0 (Voucher)</Text>
              </View>
            </View>
          </View>
          <PaymentSection
            summary={{
              planName: "tes",
              price: `tes2`,
              duration: `tes`,
              total: `tes`
            }}
            onSelectMethod={(id) => {
              setPaymentId(id)
              setBankId("")
            }}
            onSelectBank={(id) => {
              setBankId(id)
              setPaymentId("")
            }}
          />
          {/* CHECKBOX KETENTUAN */}
          <TouchableOpacity
            className="mb-4 mt-4 flex-row items-start gap-3"
            onPress={() => setIsChecked(!isChecked)}
            activeOpacity={0.7}
          >
            <View
              className={`mt-0.5 h-5 w-5 items-center justify-center rounded ${isChecked ? "bg-primary" : "border border-border bg-surface"}`}
            >
              {isChecked && (
                <Ionicons
                  name="checkmark"
                  size={14}
                  color="white"
                />
              )}
            </View>
            <View className="flex-1">
              <Text className="mb-1 text-xs font-bold text-text-primary">Saya menyetujui Kebijakan Booking & Pembatalan</Text>
              <Text className="text-[10px] leading-4 text-text-secondary">
                Pembatalan atau reschedule gratis maksimal 4 jam sebelum sesi dimulai. Turnstile gate akan memberikan akses otomatis 30
                menit sebelum jadwal sesi.
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* BOTTOM ACTION BUTTONS */}
      <View className="absolute bottom-0 left-0 right-0 border-t border-border/40 bg-background px-5 py-4 pb-8">
        <TouchableOpacity
          className={`mb-3 w-full flex-row items-center justify-center gap-2 rounded-xl py-3.5 ${isChecked ? "bg-primary" : "bg-primary/50"}`}
          onPress={handleConfirm}
        >
          <Ionicons
            name="checkmark-circle-outline"
            size={20}
            color="white"
          />
          <Text className="text-sm font-bold text-white">Confirm Booking</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleRescedule}
          className="w-full flex-row items-center justify-center gap-2 rounded-xl border border-border/50 bg-surface py-3.5"
        >
          <MaterialCommunityIcons
            name="calendar-refresh"
            size={18}
            color="#B8BDC7"
          />
          <Text className="text-sm font-semibold text-text-primary">Pilih Ulang Slot Waktu</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}
