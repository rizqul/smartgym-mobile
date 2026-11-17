import { DATES, SLOTS } from "@/data/dummyProfilTrainer"
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"
import { useRouter } from "expo-router"
import React, { useState } from "react"
import { Image, ScrollView, StatusBar, Text, TouchableOpacity, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

const TIME_SLOTS = SLOTS

export default function TrainerProfile() {
  const router = useRouter()
  const [selectedTime, setSelectedTime] = useState(TIME_SLOTS[0])

  const onNext = () => {
    router.push("/trainer/booking-confirm")
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <StatusBar barStyle="light-content" />

      <View className="flex-row items-center justify-between px-5 py-4">
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
          <Text className="text-lg font-bold text-text-primary">Trainer Profile</Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="pb-32"
      >
        {/* ================= HERO SECTION ================= */}
        <View className="mb-6 px-5">
          <View className="overflow-hidden rounded-3xl bg-surface">
            {/* Image Area */}
            <View className="relative h-[320px] w-full bg-border/30">
              <Image
                source={{ uri: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=600&auto=format&fit=crop" }}
                className="h-full w-full"
                resizeMode="cover"
              />

              {/* Top Badges */}
              <View className="absolute left-4 right-4 top-4 flex-row justify-between">
                <View className="flex-row items-center gap-1.5 rounded-full border border-border/50 bg-background/80 px-3 py-1.5">
                  <View className="h-1.5 w-1.5 rounded-full bg-primary" />
                  <Text className="text-[10px] font-bold text-text-primary">Siap Booking</Text>
                </View>
              </View>

              {/* Text Overlay (Bottom) */}
              <LinearGradient
                colors={["transparent", "rgba(17, 19, 23, 0.9)", "#111317"]}
                className="absolute bottom-0 left-0 right-0 px-5 pb-4 pt-20"
              >
                <Text className="mb-1 text-2xl font-bold text-text-primary">Coach Rio Pratama, CSCS</Text>
                <View className="mb-3 flex-row items-center gap-1.5">
                  <MaterialCommunityIcons
                    name="arm-flex"
                    size={14}
                    color="#FF6B00"
                  />
                  <Text className="flex-1 text-xs text-text-secondary">Senior Strength & Conditioning Coach • CSCS & NASM</Text>
                </View>
                <Text className="text-xs leading-5 text-text-secondary">
                  Spesialis program Hyperthrophy, Biomechanics Form Correction, dan peningkatan kekuatan fungsional tanpa risiko cedera.
                </Text>
              </LinearGradient>
            </View>
          </View>

          {/* Stats Box (Overlapping) */}
          <View className="z-10 mx-2 -mt-6 flex-row justify-between rounded-2xl border border-border/50 bg-card p-4 shadow-lg shadow-black/50">
            <View className="my-1 w-px bg-border/50" />
            <View className="flex-1 items-center">
              <View className="mb-1 flex-row items-center gap-1">
                <Ionicons
                  name="people"
                  size={16}
                  color="#FF6B00"
                />
                <Text className="text-base font-bold text-text-primary">140+</Text>
              </View>
              <Text className="text-[10px] text-text-secondary">Member Aktif</Text>
            </View>
            <View className="my-1 w-px bg-border/50" />
            <View className="flex-1 items-center">
              <View className="mb-1 flex-row items-center gap-1">
                <Ionicons
                  name="time"
                  size={16}
                  color="#60A5FA"
                />
                <Text className="text-base font-bold text-text-primary">6+ Thn</Text>
              </View>
              <Text className="text-[10px] text-text-secondary">Pengalaman</Text>
            </View>
          </View>
        </View>

        {/* ================= SCHEDULE SECTION ================= */}
        <View className="px-5">
          <View className="mb-4 flex-row items-end justify-between">
            <View>
              <Text className="mb-1 text-xl font-bold text-text-primary">Available Schedule</Text>
              <Text className="text-xs text-text-secondary">Pilih tanggal sesi latihan minggu ini</Text>
            </View>
            <Text className="text-[10px] font-bold tracking-widest text-primary">MEI - JUN 2024</Text>
          </View>

          {/* Date Picker */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerClassName="gap-2 mb-6"
          >
            {DATES.map((item, index) => (
              <TouchableOpacity
                key={index}
                disabled={item.disabled}
                className={`h-20 w-14 items-center justify-center rounded-2xl border ${
                  item.active
                    ? "border-primary bg-primary"
                    : item.disabled
                      ? "border-border/30 bg-card/50 opacity-50"
                      : "border-border bg-card"
                }`}
              >
                <Text className={`mb-1 text-[10px] ${item.active ? "text-white" : "text-text-secondary"}`}>{item.day}</Text>
                <Text className={`text-xl font-bold ${item.active ? "text-white" : "text-text-primary"}`}>{item.date}</Text>
                {/* Dot Indicator */}
                <View
                  className={`mt-1 h-1.5 w-1.5 rounded-full ${item.active ? "bg-white" : item.hasDot ? "bg-success" : "bg-transparent"}`}
                />
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Info Text */}
          <View className="mb-6 flex-row items-center gap-2">
            <Ionicons
              name="information-circle-outline"
              size={16}
              color="#FF6B00"
            />
            <Text className="text-[11px] text-text-secondary">Hari aktif di-highlight oranye/hijau, trainer libur di-nonaktifkan.</Text>
          </View>

          {/* Time Slots List */}
          <View className="mb-3 flex-row items-center justify-between">
            <Text className="text-base font-bold text-text-primary">Slot Latihan (Selasa, 28 Mei)</Text>
            <Text className="text-[10px] font-bold text-text-secondary">WIB (GMT+7)</Text>
          </View>

          <View className="gap-3">
            {TIME_SLOTS.map((slot) => (
              <TouchableOpacity
                key={slot.id}
                disabled={slot.disabled}
                onPress={() => setSelectedTime(slot)}
                className={`flex-row items-center rounded-2xl border p-4 ${
                  slot.disabled
                    ? "border-border/30 bg-card/50 opacity-50"
                    : selectedTime.id === slot.id
                      ? "border-primary bg-surface"
                      : "border-border bg-card"
                }`}
              >
                {/* Icon */}
                <View
                  className={`mr-3 h-10 w-10 items-center justify-center rounded-full ${
                    slot.disabled ? "bg-background" : selectedTime.id === slot.id ? "bg-primary" : "bg-background"
                  }`}
                >
                  <Ionicons
                    name={slot.disabled ? "close" : "time-outline"}
                    size={20}
                    color={selectedTime.id === slot.id && !slot.disabled ? "white" : "#B8BDC7"}
                  />
                </View>

                {/* Time & Title */}
                <View className="flex-1">
                  <Text className={`mb-0.5 text-sm font-bold ${slot.disabled ? "text-text-secondary" : "text-text-primary"}`}>
                    {slot.time}
                  </Text>
                  <Text className="text-[11px] text-text-secondary">{slot.title}</Text>
                </View>

                {/* Status Badge */}
                <View
                  className={`items-end rounded-md px-2 py-1.5 ${
                    slot.status === "Available" ? "bg-success/15" : slot.status === "Limited Slot" ? "bg-warning/15" : "bg-border/50"
                  }`}
                >
                  <Text
                    className={`mb-0.5 text-[10px] font-bold ${
                      slot.status === "Available" ? "text-success" : slot.status === "Limited Slot" ? "text-warning" : "text-text-secondary"
                    }`}
                  >
                    {slot.status}
                  </Text>
                  <Text
                    className={`text-[9px] ${
                      slot.status === "Available" ? "text-success" : slot.status === "Limited Slot" ? "text-warning" : "text-text-secondary"
                    }`}
                  >
                    {slot.slots}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* ================= STICKY BOTTOM BAR ================= */}
      <View className="absolute bottom-0 left-0 right-0 flex-row items-center justify-between border-t border-border bg-surface p-5 pb-8">
        <View>
          <Text className="mb-1 text-[9px] font-bold uppercase tracking-widest text-text-secondary">Sesi Dipilih</Text>
          <Text className="mb-0.5 text-sm font-bold text-text-primary">Selasa, 28 Mei • {selectedTime.time.split(" - ")[0]}</Text>
          <View className="flex-row items-center gap-1">
            <Ionicons
              name="checkmark-circle"
              size={12}
              color="#B8BDC7"
            />
            <Text className="text-[10px] text-text-secondary">Kupon Terpasang</Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={onNext}
          className="flex-row items-center gap-2 rounded-xl bg-primary px-6 py-3.5"
        >
          <Text className="text-sm font-bold text-white">Lanjutkan</Text>
          <Ionicons
            name="arrow-forward"
            size={16}
            color="white"
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}
