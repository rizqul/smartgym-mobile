import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import React from "react"
import { ScrollView, StatusBar, Text, TouchableOpacity, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

export default function ScanQR() {
  const router = useRouter()

  return (
    <SafeAreaView className="flex-1 bg-background">
      <StatusBar barStyle="light-content" />

      {/* HEADER */}
      <View className="flex-row items-center gap-4 border-b border-border/40 px-5 py-4">
        <TouchableOpacity
          onPress={() => router.back()}
          className="h-10 w-10 items-center justify-center rounded-xl border border-border/50 bg-surface"
        >
          <Ionicons
            name="chevron-back"
            size={20}
            color="white"
          />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-text-primary">Scan QR Code</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="px-5 pt-6 pb-10 items-center"
      >
        {/* TEXT SECTION */}
        <Text className="mb-2 text-[10px] font-bold uppercase tracking-widest text-primary">Check-In SmartGym</Text>
        <Text className="mb-2 text-center text-2xl font-bold text-text-primary">Siap untuk latihan?</Text>
        <Text className="mb-8 px-4 text-center text-sm text-text-secondary">
          Pindai QR code di pintu masuk gym untuk memulai sesi latihanmu.
        </Text>

        {/* SCANNER AREA */}
        <View className="relative mb-8 aspect-square w-full items-center justify-center overflow-hidden rounded-3xl border border-border/30 bg-surface">
          {/* Grid Pattern (Simulasi) */}
          <View className="absolute inset-0 flex-row flex-wrap opacity-10">
            {Array.from({ length: 16 }).map((_, i) => (
              <View
                key={i}
                className="h-1/4 w-1/4 border border-white/20"
              />
            ))}
          </View>

          {/* Corner Brackets */}
          <View className="absolute left-6 top-6 h-10 w-10 rounded-tl-xl border-l-4 border-t-4 border-primary" />
          <View className="absolute right-6 top-6 h-10 w-10 rounded-tr-xl border-r-4 border-t-4 border-primary" />
          <View className="absolute bottom-6 left-6 h-10 w-10 rounded-bl-xl border-b-4 border-l-4 border-primary" />
          <View className="absolute bottom-6 right-6 h-10 w-10 rounded-br-xl border-b-4 border-r-4 border-primary" />

          {/* QR Icon & Scanning Line */}
          <View className="items-center">
            <MaterialCommunityIcons
              name="qrcode-scan"
              size={64}
              color="#2D333B"
            />
            <View className="mt-2 h-1 w-48 bg-primary shadow-sm shadow-primary" />
          </View>

          <Text className="absolute bottom-20 mt-6 text-xs text-text-secondary">Posisikan QR di dalam bingkai</Text>

          {/* Floating Button */}
          <TouchableOpacity className="absolute bottom-6 flex-row items-center gap-2 rounded-full bg-border/80 px-4 py-2">
            <MaterialCommunityIcons
              name="focus-field"
              size={16}
              color="white"
            />
            <Text className="text-xs font-semibold text-white">Pindai otomatis</Text>
          </TouchableOpacity>
        </View>

        {/* ACTION BUTTONS (FLASHLIGHT & GALLERY) */}
        <View className="mb-8 flex-row gap-6">
          <TouchableOpacity className="items-center gap-2">
            <View className="h-16 w-16 items-center justify-center rounded-2xl border border-border/50 bg-surface">
              <Ionicons
                name="flash"
                size={24}
                color="white"
              />
            </View>
            <Text className="text-xs font-medium text-text-primary">Senter</Text>
          </TouchableOpacity>
        </View>

        {/* WARNING / INFO BOX */}
        <View className="mb-6 w-full flex-row items-start gap-3 rounded-2xl bg-surface p-4">
          <Ionicons
            name="information-circle-outline"
            size={20}
            color="#FF6B00"
          />
          <View className="flex-1">
            <Text className="mb-1 text-xs font-bold text-text-primary">QR code tidak terbaca?</Text>
            <Text className="text-[11px] leading-4 text-text-secondary">
              Pastikan pencahayaan cukup dan kamera menghadap lurus ke QR code.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
