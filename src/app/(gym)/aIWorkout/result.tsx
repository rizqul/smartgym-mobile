import { RootState } from "@/store/store"
import { AiExercise, SplitType } from "@/type/ai.type"
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import React, { useState } from "react"
import { ScrollView, StatusBar, Text, TouchableOpacity, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useSelector } from "react-redux"

const SPLIT_META: Record<SplitType, { label: string; chip: string; text: string }> = {
  PUSH: { label: "Push", chip: "border-primary/25 bg-primary/5", text: "text-primary-hover" },
  PULL: { label: "Pull", chip: "border-info/25 bg-info/5", text: "text-info" },
  UPPER: { label: "Upper Body", chip: "border-success/25 bg-success/5", text: "text-success" },
  LOWER: { label: "Lower Body", chip: "border-secondary/25 bg-secondary/5", text: "text-secondary" },
  FULL_BODY: { label: "Full Body", chip: "border-accent/25 bg-accent/5", text: "text-accent" }
}

const formatRest = (sec: number) => {
  if (!sec) return "-"
  if (sec < 60) return `${sec} sec`
  const m = Math.floor(sec / 60)
  const s = sec % 60
  return s === 0 ? `${m} min` : `${m} min ${s} sec`
}

type StatVariant = "days" | "total" | "duration" | "sets" | "reps" | "rest"

const STAT_STYLES: Record<StatVariant, { container: string; value: string }> = {
  days: { container: "border-info/25 bg-info/10", value: "text-info" },
  total: { container: "border-success/25 bg-success/10", value: "text-success" },
  duration: { container: "border-accent/25 bg-accent/10", value: "text-accent" },
  sets: { container: "border-info/25 bg-info/10", value: "text-info" },
  reps: { container: "border-success/25 bg-success/10", value: "text-success" },
  rest: { container: "border-secondary/25 bg-secondary/10", value: "text-secondary" }
}

function Stat({ label, value, variant }: Readonly<{ label: string; value: string; variant: StatVariant }>) {
  const style = STAT_STYLES[variant]

  return (
    <View className={`flex-1 items-center gap-0.5 rounded-lg border py-2 ${style.container}`}>
      <Text className={`text-sm font-bold ${style.value}`}>{value}</Text>
      <Text className="text-[10px] font-medium text-text-secondary">{label}</Text>
    </View>
  )
}

function ExerciseItem({ exercise, index }: Readonly<{ exercise: AiExercise; index: number }>) {
  return (
    <View className="gap-3 rounded-2xl border border-primary/20 bg-card p-4">
      <View className="flex-row items-start gap-3">
        <View className="h-8 w-8 items-center justify-center rounded-full bg-primary/25">
          <Text className="text-xs font-bold text-primary-hover">{index + 1}</Text>
        </View>
        <View className="flex-1 gap-1">
          <Text className="text-base font-bold text-text-primary">{exercise.name}</Text>
          {exercise.equipment ? (
            <View className="flex-row items-center gap-1 self-start rounded-md border border-info/20 bg-info/10 px-2 py-1">
              <MaterialCommunityIcons
                name="dumbbell"
                size={11}
                color="#B8BDC7"
              />
              <Text className="text-[10px] font-semibold text-info">{exercise.equipment}</Text>
            </View>
          ) : null}
        </View>
      </View>

      <View className="flex-row gap-2">
        <Stat
          label="Set"
          value={String(exercise.sets)}
          variant="sets"
        />
        <Stat
          label="Reps"
          value={exercise.reps}
          variant="reps"
        />
        <Stat
          label="Rest"
          value={formatRest(exercise.restTimeSec)}
          variant="rest"
        />
      </View>

      {exercise.notes ? (
        <View className="flex-row items-start gap-2 rounded-lg border border-primary/30 bg-primary/10 p-3">
          <Ionicons
            name="bulb-outline"
            size={14}
            color="#FF8A33"
          />
          <Text className="flex-1 text-xs leading-5 text-text-body">{exercise.notes}</Text>
        </View>
      ) : null}
    </View>
  )
}

export default function AIWorkoutDetail() {
  const router = useRouter()
  const plan = useSelector((state: RootState) => state.aiWorkout.currentPlan)
  const [activeDay, setActiveDay] = useState(0)

  const schedule = plan?.schedule ?? []
  const day = schedule[activeDay]
  const totalExercises = schedule.reduce((sum, d) => sum + (d.exercises?.length ?? 0), 0)
  const avgDuration = schedule.length
    ? Math.round(schedule.reduce((sum, d) => sum + (d.estimatedDurationMin ?? 0), 0) / schedule.length)
    : 0

  return (
    <SafeAreaView className="flex-1 bg-background">
      <StatusBar barStyle="light-content" />

      {/* HEADER */}
      <View className="flex-row items-center gap-4 border-b border-primary/20 px-5 py-4">
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
        <Text className="text-lg font-bold text-text-primary">Plan Details</Text>
      </View>

      {!plan ? (
        <View className="flex-1 items-center justify-center gap-3 px-8">
          <Ionicons
            name="document-outline"
            size={40}
            color="#B8BDC7"
          />
          <Text className="text-center text-sm text-text-secondary">No plan yet. Create a new plan to get started.</Text>
          <TouchableOpacity
            onPress={() => router.replace("/(gym)/aIWorkout/configurator")}
            className="rounded-xl border border-primary/40 bg-primary/10 px-5 py-2.5"
          >
            <Text className="text-xs font-bold text-primary-hover">Create Plan</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerClassName="px-5 pt-5 pb-12 gap-5"
        >
          {/* RINGKASAN PLAN */}
          <View className="gap-4 rounded-2xl border border-primary/40 bg-card p-5">
            <View className="gap-1.5">
              <View className="flex-row items-center gap-1.5 self-start rounded-full border border-primary/50 bg-primary/15 px-3 py-1">
                <MaterialCommunityIcons
                  name="robot-outline"
                  size={12}
                  color="#FF8A33"
                />
                <Text className="text-[10px] font-bold uppercase tracking-wide text-primary-hover">AI-generated</Text>
              </View>
              <Text className="text-2xl font-bold text-text-primary">{plan.title}</Text>
              <Text className="text-sm leading-5 text-text-secondary">{plan.goal}</Text>
            </View>

            <View className="h-px bg-border" />

            <View className="flex-row gap-2">
              <Stat
                label="Days / week"
                value={String(schedule.length)}
                variant="days"
              />
              <Stat
                label="Total exercises"
                value={String(totalExercises)}
                variant="total"
              />
              <Stat
                label="Avg. duration"
                value={`${avgDuration} mnt`}
                variant="duration"
              />
            </View>
          </View>

          {/* TAB HARI */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="-mx-5"
            contentContainerClassName="gap-2 px-5"
          >
            {schedule.map((d, i) => {
              const active = i === activeDay
              return (
                <TouchableOpacity
                  key={`${d.dayName}-${i}`}
                  activeOpacity={0.8}
                  onPress={() => setActiveDay(i)}
                  className={`rounded-full border px-4 py-2 ${active ? "border-primary bg-primary" : "border-border bg-card"}`}
                >
                  <Text className={`text-xs ${active ? "font-bold text-background" : "font-semibold text-text-body"}`}>{d.dayName}</Text>
                </TouchableOpacity>
              )
            })}
          </ScrollView>

          {/* DETAIL HARI */}
          {day ? (
            <View className="gap-4">
              <View className="flex-row items-center justify-between gap-3 rounded-2xl border border-border bg-surface p-4">
                <View className="flex-1 gap-1">
                  <Text className="text-[10px] font-semibold uppercase tracking-wide text-info">Workout Focus</Text>
                  <Text className="text-base font-bold text-text-primary">{day.focus}</Text>
                </View>
                <View className="items-end gap-2">
                  <View className={`rounded-full border px-3 py-1 ${SPLIT_META[day.splitType]?.chip ?? "border-border bg-surface"}`}>
                    <Text className={`text-[10px] font-bold uppercase ${SPLIT_META[day.splitType]?.text ?? "text-text-secondary"}`}>
                      {SPLIT_META[day.splitType]?.label ?? day.splitType}
                    </Text>
                  </View>
                  <View className="flex-row items-center gap-1">
                    <Ionicons
                      name="time-outline"
                      size={12}
                      color="#B8BDC7"
                    />
                    <Text className="text-[11px] text-text-secondary">±{day.estimatedDurationMin} min</Text>
                  </View>
                </View>
              </View>

              {day.exercises?.length ? (
                day.exercises.map((exercise, i) => (
                  <ExerciseItem
                    key={`${exercise.name}-${i}`}
                    exercise={exercise}
                    index={i}
                  />
                ))
              ) : (
                <Text className="py-6 text-center text-sm text-text-secondary">No exercises planned for this day.</Text>
              )}
            </View>
          ) : null}
        </ScrollView>
      )}
    </SafeAreaView>
  )
}
