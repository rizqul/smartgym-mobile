import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import React, { useState } from "react"
import { Image, ScrollView, StatusBar, Text, TextInput, TouchableOpacity, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

export default function BookingConfirm() {
  const router = useRouter()
  const [isChecked, setIsChecked] = useState(false)

  const handleConfirm = () => {
    if (isChecked) {
      router.push("/trainer/booking-success")
    }
  }
  const handleRescedule = () => {
    router.push("/trainer/trainerProfil")
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <StatusBar barStyle="light-content" />

      {/* HEADER */}
      <View className="flex-row items-center justify-between border-b border-border/40 px-5 py-4">
        <View className="flex-row items-center gap-4">
          <TouchableOpacity
            onPress={() => router.back()}
            className="h-10 w-10 justify-center"
          >
            <Ionicons
              name="arrow-back"
              size={24}
              color="white"
            />
          </TouchableOpacity>
          <Text className="text-lg font-bold text-text-primary">Booking Confirmation</Text>
        </View>
      </View>

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

          {/* CATATAN UNTUK TRAINER */}
          <View className="mb-6 rounded-2xl border border-border/50 bg-card p-4">
            <View className="mb-2 flex-row items-center justify-between">
              <View className="flex-row items-center gap-2">
                <MaterialCommunityIcons
                  name="text-box-edit-outline"
                  size={18}
                  color="#FF6B00"
                />
                <Text className="text-sm font-bold text-text-primary">Catatan untuk Trainer</Text>
              </View>
              <Text className="text-[10px] text-text-secondary">Opsional</Text>
            </View>
            <Text className="mb-3 text-[11px] text-text-secondary">Tuliskan fokus latihan atau kondisi fisik tekini untuk coach.</Text>

            {/* Chips */}
            <View className="mb-3 flex-row flex-wrap gap-2">
              {["+ Fokus Upper Body", "+ Form Correction", "+ Recovery / Mobility"].map((chip, idx) => (
                <TouchableOpacity
                  key={idx}
                  className="rounded-md border border-border/50 bg-surface px-2 py-1.5"
                >
                  <Text className="text-[10px] font-semibold text-text-primary">{chip}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Text Area */}
            <TextInput
              multiline
              numberOfLines={4}
              placeholder="Contoh: Fokus latihan otot dada dan perbaikan teknik bench press, bahu kanan sempat sedikit pegal..."
              placeholderTextColor="#6B7280"
              className="text-top rounded-xl border border-border/50 bg-surface p-3 text-xs text-text-primary"
              style={{ minHeight: 80 }}
            />
          </View>

          {/* CHECKBOX KETENTUAN */}
          <TouchableOpacity
            className="mb-4 flex-row items-start gap-3"
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
