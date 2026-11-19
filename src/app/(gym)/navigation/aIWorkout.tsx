import { getSavedPlans } from "@/service/ai.service"
import { WorkoutPlan } from "@/type/Ai.type"
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons"
import { useFocusEffect, useRouter } from "expo-router"
import React, { useCallback, useState } from "react"
import { ActivityIndicator, ScrollView, StatusBar, Text, TouchableOpacity, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

export default function AIHome() {
  const router = useRouter()
  const [plans, setPlans] = useState<WorkoutPlan[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useFocusEffect(
    useCallback(() => {
      let isActive = true
      const fetchPlans = async () => {
        setIsLoading(true)
        const data = await getSavedPlans()
        if (isActive) {
          setPlans(data)
          setIsLoading(false)
        }
      }
      fetchPlans()
      return () => {
        isActive = false
      }
    }, [])
  )

  return (
    <SafeAreaView className="flex-1 bg-background">
      <StatusBar barStyle="light-content" />

      {/* HEADER */}
      <View className="flex-row items-center justify-between border-b border-border/40 px-5 py-4">
        <View className="flex-row items-center gap-3">
          <View className="h-2 w-2 rounded-full bg-primary" />
          <Text className="text-lg font-bold text-text-primary">AI Trainer Hub</Text>
        </View>
        <MaterialCommunityIcons
          name="robot-outline"
          size={24}
          color="#FF6B00"
        />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="px-5 pt-6 pb-24"
      >
        {/* BANNER */}
        <View className="mb-6 flex-row items-center justify-between rounded-xl border border-border/50 bg-surface p-4">
          <View className="mr-4 flex-1">
            <Text className="mb-1 text-sm font-bold text-text-primary">Neural Copilot v3.2</Text>
            <Text className="text-[11px] text-text-secondary">
              Sistem siap. Buat jadwal latihan baru yang disesuaikan dengan kondisi gym hari ini.
            </Text>
          </View>
          <TouchableOpacity
            className="flex-row items-center gap-2 rounded-xl bg-primary px-4 py-2.5"
            onPress={() => router.push("/(gym)/aIWorkout/configurator")}
          >
            <Ionicons
              name="add"
              size={16}
              color="#111317"
            />
            <Text className="text-xs font-bold text-[#111317]">Buat / Reschedule</Text>
          </TouchableOpacity>
        </View>

        {/* LIST JADWAL */}
        <Text className="mb-4 text-sm font-bold text-text-primary">Jadwal Tersimpan Anda</Text>

        {isLoading ? (
          <ActivityIndicator
            size="large"
            color="#FF6B00"
            className="mt-10"
          />
        ) : plans.length === 0 ? (
          <View className="items-center justify-center py-10 opacity-50">
            <MaterialCommunityIcons
              name="calendar-blank-outline"
              size={48}
              color="#B8BDC7"
              className="mb-4"
            />
            <Text className="text-sm text-text-secondary">Belum ada jadwal. Buat jadwal pertama Anda!</Text>
          </View>
        ) : (
          <View className="gap-4">
            {plans.map((plan) => (
              <TouchableOpacity
                key={plan.id}
                className="rounded-2xl border border-border/50 bg-card p-4"
                // Anda bisa arahkan ke screen detail workout di sini
                // onPress={() => router.push(`/(gym)/ai/detail/${plan.id}`)}
              >
                <View className="mb-2 flex-row items-start justify-between">
                  <View className="flex-1">
                    <Text className="mb-1 text-base font-bold text-text-primary">{plan.title}</Text>
                    <Text className="text-[11px] text-text-secondary">Goal: {plan.goal}</Text>
                  </View>
                  <View className="rounded-md border border-border/50 bg-surface px-2 py-1">
                    <Text className="text-[9px] text-text-secondary">
                      {new Date(plan.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short" })}
                    </Text>
                  </View>
                </View>

                <View className="mt-2 flex-row gap-2">
                  <View className="rounded border border-primary/20 bg-primary/10 px-2 py-1">
                    <Text className="text-[10px] font-bold text-primary">{plan.config.primaryTarget}</Text>
                  </View>
                  <View className="rounded border border-border/50 bg-surface px-2 py-1">
                    <Text className="text-[10px] font-bold text-text-secondary">{plan.exercises.length} Exercises</Text>
                  </View>
                </View>

                <View className="mt-4 flex-row items-center justify-between border-t border-border/30 pt-3">
                  <Text className="text-[10px] text-text-secondary">Split: {plan.config.weeklySplit}</Text>
                  <View className="flex-row items-center gap-1">
                    <Text className="text-xs font-bold text-primary">Lihat Detail</Text>
                    <Ionicons
                      name="arrow-forward"
                      size={12}
                      color="#FF6B00"
                    />
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}
