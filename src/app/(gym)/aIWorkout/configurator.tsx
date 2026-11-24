import { generateWorkoutPlan } from "@/service/ai.service"
import { setCurrentPlan } from "@/store/slice/aiWorkoutSlice"
import { AppDispatch } from "@/store/store"
import { AiWorkoutRequest } from "@/type/ai.type"
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import React, { useState } from "react"
import { ActivityIndicator, ScrollView, StatusBar, Switch, Text, TouchableOpacity, View } from "react-native"
import { ALERT_TYPE, Toast } from "react-native-alert-notification"
import { SafeAreaView } from "react-native-safe-area-context"
import { useDispatch } from "react-redux"

type Option<T> = { value: T; label: string }

const TARGET_OPTIONS = ["Weight Loss", "Muscle Gain", "Raw Strength", "Endurance", "Athletic Conditioning"]

const TRAINING_AGE_OPTIONS: Option<string>[] = [
  { value: "Beginner", label: "Beginner" },
  { value: "Intermediate", label: "Interm." },
  { value: "Advanced", label: "Advanced" }
]

const SPLIT_OPTIONS: Option<number>[] = [3, 4, 5, 6].map((n) => ({ value: n, label: `${n} Days` }))

const DURATION_OPTIONS: Option<string>[] = [
  { value: "30 minutes", label: "30m" },
  { value: "45 minutes", label: "45m" },
  { value: "60 minutes", label: "60m" },
  { value: "90 minutes", label: "90m" }
]

const MUSCLE_OPTIONS = ["Chest", "Back", "Shoulders", "Legs", "Core", "Arms"]

function Chip({ label, selected, onPress }: Readonly<{ label: string; selected: boolean; onPress: () => void }>) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`flex-row items-center gap-1.5 rounded-xl px-4 py-2.5 ${selected ? "bg-primary" : "border border-border/50 bg-surface"}`}
    >
      {selected && (
        <Ionicons
          name="checkmark"
          size={14}
          color="white"
        />
      )}
      <Text className={`font-inter text-xs font-semibold ${selected ? "text-white" : "text-text-secondary"}`}>{label}</Text>
    </TouchableOpacity>
  )
}

function SegmentRow<T extends string | number>({
  options,
  value,
  onChange
}: Readonly<{ options: Option<T>[]; value: T; onChange: (v: T) => void }>) {
  return (
    <View className="flex-row gap-2">
      {options.map((opt) => {
        const active = value === opt.value
        return (
          <TouchableOpacity
            key={opt.value}
            onPress={() => onChange(opt.value)}
            className={`flex-1 items-center justify-center rounded-xl py-2.5 ${active ? "bg-primary" : "border border-border/50 bg-surface"}`}
          >
            <Text className={`font-inter text-xs font-semibold ${active ? "text-white" : "text-text-secondary"}`}>{opt.label}</Text>
          </TouchableOpacity>
        )
      })}
    </View>
  )
}

export default function AIConfigurator() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const dispatch = useDispatch<AppDispatch>()

  const [config, setConfig] = useState<AiWorkoutRequest>({
    primaryTarget: "Muscle Gain",
    trainingAge: "Intermediate",
    weeklySplitInDays: 4,
    sessionDuration: "45 minutes",
    focusAnatomy: ["Chest", "Arms"],
    prioritizeMachines: true,
    avoidMaintenance: true
  })

  const canGenerate = config.focusAnatomy.length > 0 && !isLoading

  const toggleFocus = (muscle: string) => {
    setConfig((prev) => ({
      ...prev,
      focusAnatomy: prev.focusAnatomy.includes(muscle) ? prev.focusAnatomy.filter((m) => m !== muscle) : [...prev.focusAnatomy, muscle]
    }))
  }

  const handleGenerate = async () => {
    if (!canGenerate) return
    setIsLoading(true)
    try {
      const plan = await generateWorkoutPlan(config)
      dispatch(setCurrentPlan(plan))
      router.replace("/(gym)/aIWorkout/result")
    } catch (error: any) {
      console.error(error.response?.status, error.response?.data ?? error)
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: "Gagal membuat plan",
        textBody:
          error.code === "ECONNABORTED"
            ? "Proses terlalu lama. Coba lagi beberapa saat."
            : (error.response?.data?.message ?? "Terjadi kesalahan. Silakan coba lagi."),
        autoClose: 3500
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <StatusBar barStyle="light-content" />

      {/* HEADER */}
      <View className="flex-row items-center justify-between border-b border-border/40 px-5 py-4">
        <TouchableOpacity
          onPress={() => router.back()}
          className="h-8 w-8 justify-center"
        >
          <Ionicons
            name="arrow-back"
            size={24}
            color="white"
          />
        </TouchableOpacity>
        <View className="flex-row items-center gap-2">
          <MaterialCommunityIcons
            name="tune-vertical"
            size={16}
            color="#FF6B00"
          />
          <Text className="font-inter text-base font-bold text-text-primary">Neural Routine Configurator</Text>
        </View>
        <View className="h-8 w-8" />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="px-5 pt-6 pb-10"
      >
        {/* 1. PRIMARY TARGET */}
        <View className="mb-4 rounded-2xl border border-border/50 bg-card p-4">
          <View className="mb-3 flex-row items-center justify-between">
            <Text className="font-inter text-xs font-bold text-text-primary">1. PRIMARY TARGET</Text>
            <Text className="font-inter text-[10px] text-text-secondary">Biometric Optimization</Text>
          </View>
          <View className="flex-row flex-wrap gap-2">
            {TARGET_OPTIONS.map((opt) => (
              <Chip
                key={opt}
                label={opt}
                selected={config.primaryTarget === opt}
                onPress={() => setConfig({ ...config, primaryTarget: opt })}
              />
            ))}
          </View>
        </View>

        {/* 2. TRAINING AGE */}
        <View className="mb-4 rounded-2xl border border-border/50 bg-card p-4">
          <Text className="mb-3 font-inter text-xs font-bold text-text-primary">2. TRAINING AGE</Text>
          <SegmentRow
            options={TRAINING_AGE_OPTIONS}
            value={config.trainingAge}
            onChange={(v) => setConfig({ ...config, trainingAge: v })}
          />
        </View>

        {/* 3. WEEKLY SPLIT */}
        <View className="mb-4 rounded-2xl border border-border/50 bg-card p-4">
          <Text className="mb-3 font-inter text-xs font-bold text-text-primary">3. WEEKLY SPLIT</Text>
          <SegmentRow
            options={SPLIT_OPTIONS}
            value={config.weeklySplitInDays}
            onChange={(v) => setConfig({ ...config, weeklySplitInDays: v })}
          />
        </View>

        {/* 4. TARGET SESSION DURATION */}
        <View className="mb-4 rounded-2xl border border-border/50 bg-card p-4">
          <View className="mb-3 flex-row items-center justify-between">
            <Text className="font-inter text-xs font-bold text-text-primary">4. TARGET SESSION DURATION</Text>
            <Text className="font-inter text-[10px] font-bold text-primary">45 Minutes optimal</Text>
          </View>
          <SegmentRow
            options={DURATION_OPTIONS}
            value={config.sessionDuration}
            onChange={(v) => setConfig({ ...config, sessionDuration: v })}
          />
        </View>

        {/* 5. FOCUS ANATOMY */}
        <View className="mb-4 rounded-2xl border border-border/50 bg-card p-4">
          <View className="mb-3 flex-row items-center justify-between">
            <Text className="font-inter text-xs font-bold text-text-primary">5. FOCUS ANATOMY</Text>
            <Text className="font-inter text-[10px] text-text-secondary">Multi-Select Enabled</Text>
          </View>
          <View className="flex-row flex-wrap gap-2">
            {MUSCLE_OPTIONS.map((opt) => (
              <View
                key={opt}
                className="w-[31%]"
              >
                <Chip
                  label={opt}
                  selected={config.focusAnatomy.includes(opt)}
                  onPress={() => toggleFocus(opt)}
                />
              </View>
            ))}
          </View>
          {config.focusAnatomy.length === 0 ? (
            <Text className="mt-3 font-inter text-[11px] text-danger">Select at least one muscle group.</Text>
          ) : null}
        </View>

        {/* 6. EQUIPMENT PREFERENCES */}
        <View className="mb-6 rounded-2xl border border-border/50 bg-card p-4">
          <View className="mb-4 flex-row items-center gap-2">
            <MaterialCommunityIcons
              name="wifi"
              size={16}
              color="#FF6B00"
            />
            <Text className="font-inter text-xs font-bold text-text-primary">6. CLUB TELEMETRY SYNC</Text>
          </View>

          <View className="gap-4">
            <View className="flex-row items-center justify-between">
              <View className="mr-4 flex-1">
                <Text className="mb-0.5 font-inter text-xs font-bold text-text-primary">Prioritize Available Machines</Text>
                <Text className="font-inter text-[10px] text-text-secondary">
                  Prioritize equipment that is currently available in your gym
                </Text>
              </View>
              <Switch
                value={config.prioritizeMachines}
                onValueChange={(val) => setConfig({ ...config, prioritizeMachines: val })}
                trackColor={{ false: "#2D333B", true: "#FF6B00" }}
                thumbColor="#FFFFFF"
              />
            </View>

            <View className="flex-row items-center justify-between">
              <View className="mr-4 flex-1">
                <Text className="mb-0.5 font-inter text-xs font-bold text-text-primary">Avoid Maintenance Equipment</Text>
                <Text className="font-inter text-[10px] text-text-secondary">Avoid equipment that is currently under maintenance</Text>
              </View>
              <Switch
                value={config.avoidMaintenance}
                onValueChange={(val) => setConfig({ ...config, avoidMaintenance: val })}
                trackColor={{ false: "#2D333B", true: "#FF6B00" }}
                thumbColor="#FFFFFF"
              />
            </View>
          </View>
        </View>

        {/* GENERATE BUTTON */}
        <TouchableOpacity
          className={`w-full flex-row items-center justify-center gap-2 rounded-2xl bg-primary py-4 shadow-lg shadow-primary/30 ${
            canGenerate || isLoading ? "" : "opacity-50"
          }`}
          onPress={handleGenerate}
          disabled={!canGenerate}
        >
          {isLoading ? (
            <ActivityIndicator color="#111317" />
          ) : (
            <>
              <Ionicons
                name="flash"
                size={20}
                color="#111317"
              />
              <Text className="font-inter text-sm font-bold text-[#111317]">Generate AI Workout Plan</Text>
            </>
          )}
        </TouchableOpacity>

        {isLoading ? (
          <Text className="mt-3 text-center font-inter text-[11px] text-text-secondary">
            AI is creating your plan. This may take up to one minute.
          </Text>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  )
}
