import MembershipGate from "@/components/gym/templates/membershipGate"
import { RootState } from "@/store/store"
import { SavedWorkoutPlan, SplitType } from "@/type/ai.type"
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import React, { useState } from "react"
import { ScrollView, StatusBar, Text, TouchableOpacity, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useSelector } from "react-redux"

const SPLIT_LABEL: Record<SplitType, string> = {
  PUSH: "Push",
  PULL: "Pull",
  UPPER: "Upper",
  LOWER: "Lower",
  FULL_BODY: "Full Body"
}

export default function AIWorkout() {
  const router = useRouter()
  const [plans, setPlans] = useState<SavedWorkoutPlan[]>([])
  const [hasError, setHasError] = useState(false)
  const plan = useSelector((state: RootState) => state.aiWorkout.currentPlan)

  return (
    <MembershipGate>
      <SafeAreaView className="flex-1 bg-background">
        <StatusBar barStyle="light-content" />

        {/* HEADER */}
        <View className="flex-row items-center justify-between border-b border-border/40 px-5 py-4">
          <View className="flex-row items-center gap-3">
            <View className="h-2 w-2 rounded-full bg-primary" />
            <Text className="font-inter text-xl font-bold text-text-primary">AI Trainer Hub</Text>
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
              <Text className="mb-1 font-inter text-base font-bold text-text-primary">Create a New Plan</Text>
              <Text className="font-inter text-xs text-text-secondary">
                Build a workout schedule tailored to your goals and the gym equipment available today.
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
              <Text className="font-inter text-sm font-bold text-background">Create Plan</Text>
            </TouchableOpacity>
          </View>

          <Text className="mb-4 font-inter text-base font-bold text-text-primary">Recent Plans</Text>

          {plan ? (
            <TouchableOpacity
              activeOpacity={0.85}
              className="gap-3 rounded-2xl border border-border bg-card p-4"
              onPress={() => router.push("/(gym)/aIWorkout/result")}
            >
              <Text
                className="font-inter text-lg font-bold text-text-primary"
                numberOfLines={2}
              >
                {plan.title}
              </Text>
              <Text
                className="font-inter text-sm text-text-secondary"
                numberOfLines={2}
              >
                {plan.goal}
              </Text>
              <View className="flex-row items-center justify-end gap-1 border-t border-border pt-3">
                <Text className="font-inter text-sm font-bold text-primary-hover">View Details</Text>
                <Ionicons
                  name="arrow-forward"
                  size={12}
                  color="#FF8A33"
                />
              </View>
            </TouchableOpacity>
          ) : (
            <View className="items-center gap-3 py-10">
              <MaterialCommunityIcons
                name="calendar-blank-outline"
                size={48}
                color="#6B7280"
              />
              <Text className="text-center font-inter text-base text-text-secondary">No plans yet. Create your first plan!</Text>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </MembershipGate>
  )
}
