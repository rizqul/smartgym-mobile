import { generateAndSavePlan } from "@/service/ai.service"
import { WorkoutConfig } from "@/utils/types/Ai.type"
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import React, { useState } from "react"
import { ActivityIndicator, ScrollView, StatusBar, Switch, Text, TouchableOpacity, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

export default function AIConfigurator() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  // State Form
  const [config, setConfig] = useState<WorkoutConfig>({
    primaryTarget: "Muscle Gain",
    trainingAge: "Interm.",
    weeklySplit: "4 Days",
    sessionDuration: "45m",
    focusAnatomy: ["Chest", "Arms"],
    prioritizeMachines: true,
    avoidMaintenance: true,
    includeWarmup: true
  })

  const toggleFocus = (muscle: string) => {
    setConfig((prev) => ({
      ...prev,
      focusAnatomy: prev.focusAnatomy.includes(muscle) ? prev.focusAnatomy.filter((m) => m !== muscle) : [...prev.focusAnatomy, muscle]
    }))
  }

  const handleGenerate = async () => {
    setIsLoading(true)
    try {
      await generateAndSavePlan(config)
      router.replace("/(gym)/navigation/aIWorkout")
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  // Komponen Pembantu untuk Chip Pilihan
  const Chip = ({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) => (
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
      <Text className={`text-xs font-semibold ${selected ? "text-white" : "text-text-secondary"}`}>{label}</Text>
    </TouchableOpacity>
  )

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
          <Text className="text-base font-bold text-text-primary">Neural Routine Configurator</Text>
        </View>
        <Text className="text-[10px] font-bold text-text-secondary">Step 1 to 6</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="px-5 pt-6 pb-10"
      >
        {/* 1. PRIMARY TARGET */}
        <View className="mb-4 rounded-2xl border border-border/50 bg-card p-4">
          <View className="mb-3 flex-row items-center justify-between">
            <Text className="text-xs font-bold text-text-primary">1. PRIMARY TARGET</Text>
            <Text className="text-[10px] text-text-secondary">Biometric Optimization</Text>
          </View>
          <View className="flex-row flex-wrap gap-2">
            {["Weight Loss", "Muscle Gain", "Raw Strength", "Endurance", "Athletic Conditioning"].map((opt) => (
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
          <Text className="mb-3 text-xs font-bold text-text-primary">2. TRAINING AGE</Text>
          <View className="flex-row gap-2">
            {["Beginner", "Interm.", "Advanced"].map((opt) => (
              <TouchableOpacity
                key={opt}
                onPress={() => setConfig({ ...config, trainingAge: opt })}
                className={`flex-1 items-center justify-center rounded-xl py-2.5 ${config.trainingAge === opt ? "bg-primary" : "border border-border/50 bg-surface"}`}
              >
                <Text className={`text-xs font-semibold ${config.trainingAge === opt ? "text-white" : "text-text-secondary"}`}>{opt}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* 3. WEEKLY SPLIT */}
        <View className="mb-4 rounded-2xl border border-border/50 bg-card p-4">
          <Text className="mb-3 text-xs font-bold text-text-primary">3. WEEKLY SPLIT</Text>
          <View className="flex-row gap-2">
            {["3 Days", "4 Days", "5 Days", "6 Days"].map((opt) => (
              <TouchableOpacity
                key={opt}
                onPress={() => setConfig({ ...config, weeklySplit: opt })}
                className={`flex-1 items-center justify-center rounded-xl py-2.5 ${config.weeklySplit === opt ? "bg-primary" : "border border-border/50 bg-surface"}`}
              >
                <Text className={`text-xs font-semibold ${config.weeklySplit === opt ? "text-white" : "text-text-secondary"}`}>{opt}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* 4. TARGET SESSION DURATION */}
        <View className="mb-4 rounded-2xl border border-border/50 bg-card p-4">
          <View className="mb-3 flex-row items-center justify-between">
            <Text className="text-xs font-bold text-text-primary">4. TARGET SESSION DURATION</Text>
            <Text className="text-[10px] font-bold text-primary">45 Minutes optimal</Text>
          </View>
          <View className="flex-row gap-2">
            {["30m", "45m", "60m", "90m"].map((opt) => (
              <TouchableOpacity
                key={opt}
                onPress={() => setConfig({ ...config, sessionDuration: opt })}
                className={`flex-1 items-center justify-center rounded-xl py-2.5 ${config.sessionDuration === opt ? "bg-primary" : "border border-border/50 bg-surface"}`}
              >
                <Text className={`text-xs font-semibold ${config.sessionDuration === opt ? "text-white" : "text-text-secondary"}`}>
                  {opt}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* 5. FOCUS ANATOMY */}
        <View className="mb-4 rounded-2xl border border-border/50 bg-card p-4">
          <View className="mb-3 flex-row items-center justify-between">
            <Text className="text-xs font-bold text-text-primary">5. FOCUS ANATOMY</Text>
            <Text className="text-[10px] text-text-secondary">Multi-Select Enabled</Text>
          </View>
          <View className="flex-row flex-wrap gap-2">
            {["Chest", "Back", "Shoulders", "Legs", "Core", "Arms"].map((opt) => (
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
        </View>

        {/* 6. CLUB TELEMETRY SYNC */}
        <View className="mb-6 rounded-2xl border border-border/50 bg-card p-4">
          <View className="mb-4 flex-row items-center gap-2">
            <MaterialCommunityIcons
              name="wifi"
              size={16}
              color="#FF6B00"
            />
            <Text className="text-xs font-bold text-text-primary">6. CLUB TELEMETRY SYNC</Text>
          </View>

          <View className="gap-4">
            <View className="flex-row items-center justify-between">
              <View className="mr-4 flex-1">
                <Text className="mb-0.5 text-xs font-bold text-text-primary">Prioritize Available Machines</Text>
                <Text className="text-[10px] text-text-secondary">Bypass high-traffic zones ({">"}75% wait time)</Text>
              </View>
              <Switch
                value={config.prioritizeMachines}
                onValueChange={(val) => setConfig({ ...config, prioritizeMachines: val })}
                trackColor={{ false: "#2D333B", true: "#FF6B00" }}
                thumbColor={"#FFFFFF"}
              />
            </View>

            <View className="flex-row items-center justify-between">
              <View className="mr-4 flex-1">
                <Text className="mb-0.5 text-xs font-bold text-text-primary">Avoid Maintenance Equipment</Text>
                <Text className="text-[10px] text-text-secondary">Automatically reroute around reported hardware</Text>
              </View>
              <Switch
                value={config.avoidMaintenance}
                onValueChange={(val) => setConfig({ ...config, avoidMaintenance: val })}
                trackColor={{ false: "#2D333B", true: "#FF6B00" }}
                thumbColor={"#FFFFFF"}
              />
            </View>

            <View className="flex-row items-center justify-between">
              <View className="mr-4 flex-1">
                <Text className="mb-0.5 text-xs font-bold text-text-primary">Include Dynamic Warm-up</Text>
                <Text className="text-[10px] text-text-secondary">5-min CNS & joint mobility activation protocols</Text>
              </View>
              <Switch
                value={config.includeWarmup}
                onValueChange={(val) => setConfig({ ...config, includeWarmup: val })}
                trackColor={{ false: "#2D333B", true: "#FF6B00" }}
                thumbColor={"#FFFFFF"}
              />
            </View>
          </View>
        </View>

        {/* GENERATE BUTTON */}
        <TouchableOpacity
          className="w-full flex-row items-center justify-center gap-2 rounded-2xl bg-primary py-4 shadow-lg shadow-primary/30"
          onPress={handleGenerate}
          disabled={isLoading}
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
              <Text className="text-sm font-bold text-[#111317]">Generate AI Workout Plan</Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  )
}
