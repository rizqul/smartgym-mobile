import { RootState } from "@/store/store"
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import React from "react"
import { Text, TouchableOpacity, View } from "react-native"
import { useSelector } from "react-redux"

export const AiSummaryCard = () => {
  const router = useRouter()
  const plan = useSelector((state: RootState) => state.aiWorkout.currentPlan)

  const totalExercises = plan?.schedule?.reduce((sum, day) => sum + (day.exercises?.length ?? 0), 0) ?? 0
  const totalDays = plan?.schedule?.length ?? 0
  const avgDuration = totalDays
    ? Math.round((plan?.schedule ?? []).reduce((sum, day) => sum + (day.estimatedDurationMin ?? 0), 0) / totalDays)
    : 0
  const focusList = Array.from(new Set((plan?.schedule ?? []).flatMap((day) => (day.focus ? [day.focus] : [])))).slice(0, 3)

  return (
    <View className="gap-4 rounded-[20px] border border-primary/20 bg-surface p-4">
      <View className="flex-row items-start justify-between gap-3">
        <View className="flex-1 gap-1">
          <View className="flex-row items-center gap-2">
            <View className="h-8 w-8 items-center justify-center rounded-full bg-primary/15">
              <MaterialCommunityIcons
                name="robot-outline"
                size={18}
                color="#FF8A33"
              />
            </View>
            <Text className="text-sm font-bold text-text-primary">AI Workout Summary</Text>
          </View>
          <Text className="text-[11px] leading-4 text-text-secondary">
            Summary of the latest AI training plan from endpoint{" "}
            <Text className="font-semibold text-primary-hover">/member/ai/generate</Text>.
          </Text>
        </View>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => router.push("/(gym)/navigation/aIWorkout")}
          className="rounded-full border border-border bg-card px-3 py-1.5"
        >
          <Text className="text-[10px] font-semibold text-text-body">AI Hub</Text>
        </TouchableOpacity>
      </View>

      {plan ? (
        <>
          <View className="gap-1.5 rounded-2xl border border-border/60 bg-card p-3.5">
            <Text
              className="text-base font-bold text-text-primary"
              numberOfLines={2}
            >
              {plan.title}
            </Text>
            <Text
              className="text-xs leading-5 text-text-secondary"
              numberOfLines={3}
            >
              {plan.goal}
            </Text>
          </View>

          <View className="flex-row gap-2">
            <View className="flex-1 items-center rounded-xl bg-card py-3">
              <Text className="text-sm font-bold text-text-primary">{totalDays}</Text>
              <Text className="text-[10px] text-text-subdued">Days/week</Text>
            </View>
            <View className="flex-1 items-center rounded-xl bg-card py-3">
              <Text className="text-sm font-bold text-text-primary">{totalExercises}</Text>
              <Text className="text-[10px] text-text-subdued">Total Exercises</Text>
            </View>
            <View className="flex-1 items-center rounded-xl bg-card py-3">
              <Text className="text-sm font-bold text-text-primary">{avgDuration}m</Text>
              <Text className="text-[10px] text-text-subdued">Average Duration</Text>
            </View>
          </View>

          {focusList.length > 0 ? (
            <View className="flex-row flex-wrap gap-2">
              {focusList.map((focus) => (
                <View
                  key={focus}
                  className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1"
                >
                  <Text className="text-[10px] font-semibold text-primary-hover">{focus}</Text>
                </View>
              ))}
            </View>
          ) : null}

          <View className="flex-row gap-2">
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => router.push("/(gym)/aIWorkout/result")}
              className="flex-1 flex-row items-center justify-center gap-2 rounded-xl bg-primary py-3"
            >
              <Ionicons
                name="sparkles"
                size={16}
                color="#111317"
              />
              <Text className="text-xs font-bold text-background">View Plan Summary</Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => router.push("/(gym)/aIWorkout/configurator")}
              className="items-center justify-center rounded-xl border border-border bg-card px-4 py-3"
            >
              <Ionicons
                name="refresh"
                size={16}
                color="#FFFFFF"
              />
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <View className="items-center gap-3 rounded-2xl border border-dashed border-border/70 bg-card/60 px-4 py-5">
          <MaterialCommunityIcons
            name="clipboard-text-clock-outline"
            size={34}
            color="#FF8A33"
          />
          <Text className="text-center text-sm font-semibold text-text-primary">No Ai summary yet</Text>
          <Text className="text-center text-[11px] leading-4 text-text-secondary">
            Generate workout plans from AI to display a summary of your goals, schedule, and training focus on the dashboard.
          </Text>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => router.push("/(gym)/aIWorkout/configurator")}
            className="mt-1 flex-row items-center gap-2 rounded-xl bg-primary px-4 py-2.5"
          >
            <Ionicons
              name="sparkles"
              size={14}
              color="#111317"
            />
            <Text className="text-xs font-bold text-background">Create an AI Workout Summary</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  )
}
