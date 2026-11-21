import { TrainerCard } from "@/components/gym/trainer/TrainerCard"
import { fetchTrainers } from "@/store/slice/trainerSlice"
import { AppDispatch, RootState } from "@/store/store"
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"
import { useRouter } from "expo-router"
import React, { useEffect } from "react"
import { ScrollView, StatusBar, Text, TextInput, TouchableOpacity, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useDispatch, useSelector } from "react-redux"

export default function TrainerScreen() {
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()
  const { result } = useSelector((state: RootState) => state.trainer)

  useEffect(() => {
    dispatch(fetchTrainers())
  }, [])

  const onShowTrainer = (id: string) => {
    router.push("/(gym)/trainer/trainerProfil")
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <StatusBar barStyle="light-content" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="pb-10"
      >
        <View className="mt-4 gap-5 px-4">
          {/* ================= SEARCH BAR ================= */}
          <View className="flex-row items-center gap-3">
            <View className="flex-1 flex-row items-center rounded-xl border border-border/50 bg-card px-4 py-1">
              <Ionicons
                name="search"
                size={20}
                color="#B8BDC7"
              />
              <TextInput
                placeholder="Cari nama trainer, spesialisasi..."
                placeholderTextColor="#B8BDC7"
                className="ml-2 flex-1 text-sm text-text-primary"
              />
            </View>
            {/* <TouchableOpacity className="h-12 w-12 items-center justify-center rounded-xl border border-border/50 bg-card">
              <MaterialCommunityIcons
                name="tune-variant"
                size={22}
                color="#FF6B00"
              />
            </TouchableOpacity> */}
          </View>

          {/* ================= FILTER CHIPS ================= */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerClassName="gap-2"
          >
            <TouchableOpacity className="rounded-full bg-primary px-4 py-2">
              <Text className="text-xs font-bold text-background">Semua</Text>
            </TouchableOpacity>
            <TouchableOpacity className="rounded-full border border-border bg-card px-4 py-2">
              <Text className="text-xs font-semibold text-text-primary">Strength & Hyperthrophy</Text>
            </TouchableOpacity>
            <TouchableOpacity className="rounded-full border border-border bg-card px-4 py-2">
              <Text className="text-xs font-semibold text-text-primary">Strength & Hyperthrophy</Text>
            </TouchableOpacity>
            <TouchableOpacity className="rounded-full border border-border bg-card px-4 py-2">
              <Text className="text-xs font-semibold text-text-primary">Strength & Hyperthrophy</Text>
            </TouchableOpacity>
            <TouchableOpacity className="rounded-full border border-border bg-card px-4 py-2">
              <Text className="text-xs font-semibold text-text-primary">Strength & Hyperthrophy</Text>
            </TouchableOpacity>
            <TouchableOpacity className="rounded-full border border-border bg-card px-4 py-2">
              <Text className="text-xs font-semibold text-text-primary">Fat Loss & HIIT</Text>
            </TouchableOpacity>
          </ScrollView>

          {/* ================= BENEFIT BANNER ================= */}
          <View className="overflow-hidden rounded-2xl border border-primary/20">
            <LinearGradient
              colors={["#3A1C0E", "#1A1D24"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View className="flex-row items-start gap-4 p-4 ">
                <View className="mt-1 h-10 w-10 items-center justify-center rounded-full bg-primary/20">
                  <MaterialCommunityIcons
                    name="medal-outline"
                    size={20}
                    color="#FF6B00"
                  />
                </View>
                <View className="flex-1">
                  <Text className="mb-1 text-[10px] font-bold tracking-widest text-text-primary">BENEFIT ANGGOTA • Pro Tier</Text>
                  <Text className="text-xs leading-4 text-text-secondary">
                    Paket SmartGym Pro kamu menyertakan <Text className="font-bold text-text-primary">4x Sesi PT Gratis</Text> tersisa!
                    Kupon otomatis diterapkan saat konfirmasi.
                  </Text>
                </View>
              </View>
            </LinearGradient>
          </View>

          {/* ================= TRAINER LIST ================= */}
          <View className="gap-5">
            {result?.map((trainer) => (
              <TrainerCard
                handleShow={onShowTrainer}
                key={trainer.id}
                data={trainer}
              />
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
