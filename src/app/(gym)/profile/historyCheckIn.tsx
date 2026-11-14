import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import React from "react"
import { ScrollView, StatusBar, Text, TouchableOpacity, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

// Data Dummy untuk Riwayat
const MOCK_HISTORY = [
  { id: "1", date: "Hari ini, 14 Nov 2026", time: "18:30", branch: "SmartGym Sudirman", duration: "1j 20m", status: "Berhasil" },
  { id: "2", date: "Rabu, 12 Nov 2026", time: "07:15", branch: "SmartGym Kemang", duration: "45m", status: "Berhasil" },
  { id: "3", date: "Senin, 10 Nov 2026", time: "19:00", branch: "SmartGym Sudirman", duration: "1j 10m", status: "Berhasil" },
  { id: "4", date: "Sabtu, 08 Nov 2026", time: "09:30", branch: "SmartGym Pacific Place", duration: "1j 30m", status: "Berhasil" }
]

export default function HistoryCheckIn() {
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
        <Text className="text-xl font-bold text-text-primary">Riwayat Check-in</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="px-5 pt-6 pb-10"
      >
        {/* SUMMARY CARD */}
        <View className="mb-6 flex-row items-center justify-between rounded-2xl border border-border bg-card p-5">
          <View>
            <Text className="mb-1 text-xs font-medium text-text-secondary">Total Kunjungan (Bulan Ini)</Text>
            <Text className="text-2xl font-bold text-text-primary">
              12 <Text className="text-sm font-normal text-text-secondary">Sesi</Text>
            </Text>
          </View>
          <View className="h-12 w-12 items-center justify-center rounded-full bg-primary/20">
            <MaterialCommunityIcons
              name="calendar-check"
              size={24}
              color="#FF6B00"
            />
          </View>
        </View>

        {/* LIST RIWAYAT */}
        <Text className="mb-4 text-base font-bold text-text-primary">Aktivitas Terbaru</Text>

        <View className="gap-4">
          {MOCK_HISTORY.map((item) => (
            <View
              key={item.id}
              className="flex-row items-center gap-4 rounded-xl border border-border/50 bg-surface p-4"
            >
              {/* Icon / Tanggal */}
              <View className="h-12 w-12 items-center justify-center rounded-xl border border-border bg-background">
                <Text className="text-xs font-bold text-primary">{item.time.split(":")[0]}</Text>
                <Text className="text-[10px] text-text-secondary">{item.time.split(":")[1]}</Text>
              </View>

              {/* Detail */}
              <View className="flex-1">
                <Text className="mb-0.5 text-sm font-bold text-text-primary">{item.branch}</Text>
                <Text className="mb-1.5 text-xs text-text-secondary">{item.date}</Text>
                <View className="flex-row items-center gap-2">
                  <View className="flex-row items-center gap-1 rounded bg-success/15 px-2 py-0.5">
                    <View className="h-1.5 w-1.5 rounded-full bg-success" />
                    <Text className="text-[10px] font-bold text-success">{item.status}</Text>
                  </View>
                  <Text className="text-[10px] text-text-secondary">• Durasi: {item.duration}</Text>
                </View>
              </View>

              {/* Chevron */}
              <Ionicons
                name="chevron-forward"
                size={16}
                color="#B8BDC7"
              />
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
