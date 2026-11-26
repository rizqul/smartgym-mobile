import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import React from "react"
import { Image, ScrollView, StatusBar, Text, TouchableOpacity, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

export default function BookingSuccess() {
  const router = useRouter()

  return (
    <SafeAreaView className="flex-1 bg-background">
      <StatusBar barStyle="light-content" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="px-5 pt-10 pb-10 items-center"
      >
        {/* HERO CHECK ICON */}
        <View className="mb-6 items-center">
          <View className="h-24 w-24 items-center justify-center rounded-full border-[4px] border-background bg-primary/10 shadow-lg shadow-primary/30">
            <View className="h-20 w-20 items-center justify-center rounded-full border-[4px] border-background bg-primary/20">
              <View className="h-16 w-16 items-center justify-center rounded-full bg-primary">
                <Ionicons
                  name="checkmark"
                  size={32}
                  color="white"
                />
              </View>
            </View>
          </View>

          {/* Pill Badge */}
          <View className="mt-4 flex-row items-center gap-2 rounded-full border border-border/50 bg-surface px-4 py-1.5">
            <View className="h-1.5 w-1.5 rounded-full bg-success" />
            <Text className="text-[10px] font-bold uppercase tracking-widest text-text-primary">Confirmed • Encrypted Sync</Text>
            <MaterialCommunityIcons
              name="sync"
              size={12}
              color="#B8BDC7"
            />
          </View>
        </View>

        {/* TITLE */}
        <Text className="mb-2 text-center text-3xl font-extrabold text-text-primary">Booking Berhasil!</Text>
        <Text className="mb-8 px-4 text-center text-sm text-text-secondary">Your training session has been booked successfully.</Text>

        {/* NOTIFICATION BANNER */}
        <View className="mb-6 w-full flex-row items-start gap-3 rounded-2xl border border-border/50 bg-surface p-4">
          <MaterialCommunityIcons
            name="calendar-check"
            size={24}
            color="#FF6B00"
          />
          <View className="flex-1">
            <Text className="mb-1 text-xs font-bold text-text-primary">Tersinkronisasi Otomatis</Text>
            <Text className="text-[11px] leading-4 text-text-secondary">
              Sesi otomatis ditambahkan ke Kalender & Notifikasi SmartBand akan bergetar 30 menit sebelum sesi.
            </Text>
          </View>
        </View>

        {/* E-TICKET CARD */}
        <View className="mb-6 w-full overflow-hidden rounded-3xl border border-border/50 bg-card">
          {/* Ticket Header */}
          <View className="flex-row items-center justify-between border-b border-border/50 bg-surface p-4">
            <View className="flex-row items-center gap-2">
              <MaterialCommunityIcons
                name="ticket"
                size={16}
                color="#B8BDC7"
              />
              <Text className="text-xs font-bold tracking-widest text-text-secondary">BOOKING ID</Text>
            </View>
            <View className="flex-row items-center gap-2">
              <Text className="text-xs font-bold text-text-primary">SG-PT-280524-09</Text>
              <Ionicons
                name="copy-outline"
                size={14}
                color="#B8BDC7"
              />
            </View>
          </View>

          <View className="p-5">
            {/* Trainer Info */}
            <View className="mb-6 flex-row items-center gap-4 border-b border-border/30 pb-6">
              <Image
                source={{ uri: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=150&auto=format&fit=crop" }}
                className="h-14 w-14 rounded-full border-2 border-border/50"
              />
              <View className="flex-1">
                <View className="mb-0.5 flex-row items-center gap-1">
                  <Text className="text-base font-bold text-text-primary">Coach Rio Pratama</Text>
                  <MaterialCommunityIcons
                    name="check-decagram"
                    size={14}
                    color="#FF6B00"
                  />
                </View>
                <Text className="mb-0.5 text-[10px] font-bold text-text-primary">CSCS CERTIFIED</Text>
                <Text className="text-[11px] text-text-secondary">Senior Strength & Conditioning Coach</Text>
              </View>
            </View>

            {/* Date & Time Grid */}
            <View className="mb-4 flex-row gap-3">
              <View className="flex-1 rounded-xl border border-border/50 bg-surface p-3">
                <View className="mb-2 flex-row items-center gap-1.5">
                  <Ionicons
                    name="calendar-outline"
                    size={12}
                    color="#FF6B00"
                  />
                  <Text className="text-[9px] font-bold text-text-secondary">TANGGAL</Text>
                </View>
                <Text className="text-xs font-semibold text-text-primary">Selasa, 28 Mei 2024</Text>
              </View>
              <View className="flex-1 rounded-xl border border-border/50 bg-surface p-3">
                <View className="mb-2 flex-row items-center gap-1.5">
                  <Ionicons
                    name="time-outline"
                    size={12}
                    color="#FF6B00"
                  />
                  <Text className="text-[9px] font-bold text-text-secondary">JAM</Text>
                </View>
                <Text className="mb-1 text-xs font-semibold text-text-primary">08.00 - 09.00 WIB</Text>
                <Text className="text-[9px] text-text-secondary">60 Menit Durasi</Text>
              </View>
            </View>

            {/* Session Type */}
            <View className="mb-3 flex-row items-center justify-between rounded-xl border border-border/50 bg-surface p-3">
              <View className="flex-row items-center gap-2">
                <MaterialCommunityIcons
                  name="arm-flex"
                  size={16}
                  color="#B8BDC7"
                />
                <View>
                  <Text className="mb-0.5 text-[9px] font-bold text-text-secondary">JENIS SESI</Text>
                  <Text className="text-xs font-semibold text-text-primary">1-on-1 Hyperthrophy & Form Check</Text>
                </View>
              </View>
              <View className="rounded bg-border px-2 py-1">
                <Text className="text-[9px] font-bold text-text-secondary">1:1 PRO</Text>
              </View>
            </View>

            {/* Location */}
            <View className="mb-3 flex-row gap-3 rounded-xl border border-border/50 bg-surface p-3">
              <Ionicons
                name="location-outline"
                size={16}
                color="#B8BDC7"
              />
              <View>
                <Text className="mb-0.5 text-[9px] font-bold text-text-secondary">LOKASI GYM</Text>
                <Text className="mb-0.5 text-xs font-semibold text-text-primary">SmartGym Central Base - Kuningan</Text>
                <Text className="text-[10px] text-text-secondary">Zone 2 - Main Strength Arena</Text>
              </View>
            </View>

            {/* Price */}
            <View className="flex-row items-center justify-between rounded-xl border border-border/50 bg-surface p-3">
              <View className="flex-row items-center gap-2">
                <Ionicons
                  name="wallet-outline"
                  size={16}
                  color="#B8BDC7"
                />
                <View>
                  <Text className="mb-0.5 text-[9px] font-bold text-text-secondary">BIAYA SESI</Text>
                  <Text className="text-xs font-semibold text-text-primary">Gratis</Text>
                </View>
              </View>
              <View className="flex-row items-center gap-1 rounded-md bg-secondary/15 px-2 py-1">
                <View className="h-1.5 w-1.5 rounded-full bg-secondary" />
                <Text className="text-[10px] font-bold text-secondary">Pro Athlete Voucher</Text>
              </View>
            </View>
          </View>

          {/* Ticket Footer (Barcode) */}
          <View className="flex-row items-center justify-between border-t border-border/50 bg-surface p-4">
            <View className="flex-row items-center gap-2">
              <MaterialCommunityIcons
                name="barcode-scan"
                size={20}
                color="#B8BDC7"
              />
              <Text className="text-[10px] text-text-secondary">Gate Turnstile Barcode siap diakses</Text>
            </View>
            <Text className="text-[10px] font-bold text-primary">SIAP PAKAI</Text>
          </View>
        </View>

        {/* ACTION BUTTONS */}
        <View className="w-full gap-3">
          <TouchableOpacity
            className="w-full flex-row items-center justify-center gap-2 rounded-xl bg-primary py-4"
            onPress={() => router.replace("/(gym)/profile/historyTransaction")}
          >
            <Ionicons
              name="calendar"
              size={18}
              color="white"
            />
            <Text className="text-sm font-bold text-white">View My Booking</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="w-full flex-row items-center justify-center gap-2 rounded-xl border border-border/50 bg-surface py-4"
            onPress={() => router.replace("/(gym)/navigation/dashboard")} // Arahkan ke dashboard
          >
            <Ionicons
              name="home"
              size={18}
              color="#B8BDC7"
            />
            <Text className="text-sm font-semibold text-text-primary">Back to Home</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
