import { useAuth } from "@/context/AuthContext"
import { Ionicons, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"
import { router } from "expo-router"
import React from "react"
import { ScrollView, StatusBar, Text, TouchableOpacity, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

const COLOR_PRIMARY = "#FF7A00"
const COLOR_INFO = "#60A5FA"
const COLOR_HIGHLIGHT = "#FFD166"

// Core
export default function Dashboard() {
  const { user } = useAuth()
  const firstName = user?.name.split(" ")[0]
  return (
    <SafeAreaView className="flex-1 bg-background">
      <StatusBar barStyle="light-content" />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="flex gap-4 px-5 pb-10 pt-3">
          {/* HEADER SECTION */}
          <View className="flex-row items-start justify-between">
            <View>
              <Text className="text-lg font-extrabold text-primary">
                SMART <Text className="text-text-primary">GYM</Text>
              </Text>
              <Text className="mt-1 text-[28px] font-bold text-text-primary">
                Hello, {firstName} <Text>👋</Text>
              </Text>
              <Text className="mt-0.5 text-sm text-text-subdued">Keep pushing your limits!</Text>
              <View className="mt-1.5 h-[3px] w-16 rounded-full bg-primary" />
            </View>

            <TouchableOpacity
              activeOpacity={0.8}
              className="h-12 w-12 items-center justify-center rounded-2xl border border-border bg-surface"
            >
              <Ionicons
                name="notifications-outline"
                size={22}
                color="#FFFFFF"
              />
              <View className="absolute right-2.5 top-2.5 h-2.5 w-2.5 rounded-full border border-surface bg-primary" />
            </TouchableOpacity>
          </View>

          {/* MEMBERSHIP CARD COMPONENT */}
          <MembershipCard />

          {/* ACTION BUTTONS */}
          <View className="flex-row gap-3">
            <ActionButton
              label="Scan Masuk"
              onPress={() => router.push("/(gym)/dashboard/scanQR")}
              icon={
                <MaterialCommunityIcons
                  name="qrcode-scan"
                  size={26}
                  color={COLOR_PRIMARY}
                />
              }
            />
            <ActionButton
              label="Berlangganan"
              onPress={() => router.push("/(gym)/dashboard/membership")}
              icon={
                <MaterialIcons
                  name="card-membership"
                  size={26}
                  color={COLOR_INFO}
                />
              }
            />
            <ActionButton
              label="Schedule"
              onPress={() => router.push("/(gym)/navigation/trainer")}
              icon={
                <MaterialCommunityIcons
                  name="calendar-check-outline"
                  size={26}
                  color={COLOR_HIGHLIGHT}
                />
              }
            />
          </View>

          {/* TRAINER SECTION */}
          <TrainerCard />

          {/* FITNESS PROGRESS */}
          <FitnessProgressCard />

          {/* WEEKLY ACTIVITY */}
          <WeeklyActivityCard />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

// Action Button (Check-in, Packages, Schedule)
const ActionButton = ({ label, icon, onPress }: { label: string; icon: React.ReactNode; onPress: () => void }) => (
  <TouchableOpacity
    activeOpacity={0.8}
    onPress={onPress}
    className="flex-1 items-center justify-center gap-2 rounded-2xl border border-border bg-surface py-4"
  >
    {icon}
    <Text className="text-xs font-semibold text-text-primary">{label}</Text>
  </TouchableOpacity>
)

// Card Membership
const MembershipCard = () => {
  const { user } = useAuth()
  const expiredDate = new Date(user?.membershipExpiredAt!)
  const joinDate = new Date(user?.createdAt!)

  const joinMemberText = joinDate.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric"
  })
  const expiredText = expiredDate.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric"
  })

  return (
    <LinearGradient
      colors={["#2E1A14", "#1A1D24", "#1A1D24"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      className="overflow-hidden  border border-border "
      style={{ padding: 20, borderRadius: 20 }}
    >
      {/* Card Header */}
      <View className="mb-5 flex-row items-center justify-between">
        <View className="flex-row items-center gap-3">
          <View className="h-11 w-11 items-center justify-center rounded-full bg-primary">
            <Ionicons
              name="flash"
              size={20}
              color="#1A1C20"
            />
          </View>
          <Text className="text-lg font-extrabold tracking-[0.5px] text-text-primary">SMARTGYM ELITE</Text>
        </View>

        <View className="flex-row items-center gap-1.5 rounded-xl border border-success/30 bg-success/15 px-3 py-1">
          <View className="h-1.5 w-1.5 rounded-full bg-success" />
          <Text className="text-[11px] font-bold text-success">ACTIVE</Text>
        </View>
      </View>

      {/* Card Body */}
      <View className="flex-row items-center">
        <View className="flex-1">
          <Text className="mb-1 text-[11px] font-semibold tracking-[0.5px] text-text-muted">Bergabung sejak</Text>
          <Text className="text-lg font-bold tracking-[1px] text-text-primary">{joinMemberText}</Text>
        </View>

        <View className="mx-4 h-10 w-px bg-primary/40" />

        <View className="flex-1 items-end">
          <Text className="mb-1 text-[11px] font-semibold tracking-[0.5px] text-text-muted">Hingga</Text>
          <Text className="text-lg font-bold text-text-primary">{expiredText}</Text>
        </View>
      </View>
    </LinearGradient>
  )
}

// Trainer Section (menggantikan Today's Workout)
const TrainerCard = () => {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => router.push("/(gym)/navigation/trainer")}
    >
      <LinearGradient
        colors={["#2E1A14", "#1A1D24", "#1A1D24"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="overflow-hidden rounded-[20px] border border-border"
        style={{ padding: 18, borderRadius: 20 }}
      >
        {/* Header */}
        <View className="mb-4 flex-row items-center justify-between">
          <View className="flex-row items-center gap-2.5">
            <MaterialCommunityIcons
              name="account-tie"
              size={24}
              color={COLOR_PRIMARY}
            />
            <Text className="text-base font-bold text-text-primary">Personal Trainer</Text>
          </View>

          <View className="flex-row items-center gap-1">
            <Text className="text-xs font-semibold text-primary">View All</Text>
            <Ionicons
              name="arrow-forward"
              size={14}
              color={COLOR_PRIMARY}
            />
          </View>
        </View>

        {/* Body */}
        <View className="items-center px-2 pb-1">
          <View className="mb-3 h-16 w-16 items-center justify-center rounded-full border border-primary/30 bg-primary/10">
            <MaterialCommunityIcons
              name="human-greeting-variant"
              size={34}
              color={COLOR_PRIMARY}
            />
          </View>
          <Text className="text-lg font-bold text-text-primary">Find your perfect trainer</Text>
          <Text className="mb-4 mt-1 text-center text-sm leading-5 text-text-subdued">
            Get guided by professionals and reach your fitness goals faster!
          </Text>

          {/* Button (visual only, seluruh card sudah bisa diklik) */}
          <View className="w-full flex-row items-center justify-center gap-2 rounded-full bg-primary py-3.5">
            <Ionicons
              name="people"
              size={18}
              color="#1A1C20"
            />
            <Text className="text-sm font-bold text-background">Explore Trainers</Text>
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  )
}

// Fitness Progress
const FitnessProgressCard = () => {
  const progress = 96

  return (
    <View className="rounded-[20px] border border-border bg-surface p-4">
      <View className="mb-3 flex-row items-center gap-2.5">
        <Ionicons
          name="stats-chart"
          size={20}
          color={COLOR_PRIMARY}
        />
        <Text className="text-base font-bold text-text-primary">Fitness Progress</Text>
      </View>

      <View className="flex-row gap-3">
        {/* Gym Time */}
        <View className="flex-1 rounded-2xl border border-border bg-background p-3">
          <View className="flex-row items-center gap-2.5">
            <Ionicons
              name="stopwatch-outline"
              size={32}
              color={COLOR_INFO}
            />
            <View>
              <Text className="text-xs text-text-subdued">Total Gym Time</Text>
              <Text className="text-2xl font-bold text-text-primary">48h</Text>
              <Text className="text-xs text-text-subdued">Target: 50h</Text>
            </View>
          </View>

          <View className="mt-3 flex-row items-center gap-2">
            <View className="h-2 flex-1 overflow-hidden rounded-full bg-border">
              <View
                className="h-full rounded-full bg-info"
                style={{ width: `${progress}%` }}
              />
            </View>
            <Text className="text-[11px] font-semibold text-text-primary">{progress}%</Text>
          </View>
        </View>

        {/* Streak */}
        <View className="flex-1 rounded-2xl border border-border bg-background p-3">
          <View className="flex-row items-center gap-2.5">
            <Ionicons
              name="flame"
              size={32}
              color={COLOR_PRIMARY}
            />
            <View>
              <Text className="text-xs text-text-subdued">Current Streak</Text>
              <Text className="text-2xl font-bold text-text-primary">6 Days</Text>
            </View>
          </View>

          <Text className="mt-2 text-xs font-semibold text-highlight">Best: 8 Days</Text>
          <Text className="text-xs text-text-subdued">Keep going!</Text>
        </View>
      </View>
    </View>
  )
}

// Weekly Activity
const WEEKLY_DATA = [
  { day: "Mon", height: 44, active: true },
  { day: "Tue", height: 54, active: true },
  { day: "Wed", height: 24, active: false },
  { day: "Thu", height: 48, active: true },
  { day: "Fri", height: 48, active: true },
  { day: "Sat", height: 36, active: true },
  { day: "Sun", height: 20, active: false }
]

const WeeklyActivityCard = () => {
  const activeDays = WEEKLY_DATA.filter((d) => d.active).length

  return (
    <View className="rounded-[20px] border border-border bg-surface p-4">
      <View className="mb-4 flex-row items-center justify-between">
        <View className="flex-row items-center gap-2.5">
          <MaterialCommunityIcons
            name="calendar-check-outline"
            size={22}
            color={COLOR_HIGHLIGHT}
          />
          <Text className="text-base font-bold text-text-primary">Weekly Activity</Text>
        </View>

        <View className="rounded-full border border-success/30 bg-success/15 px-3 py-1">
          <Text className="text-xs font-bold text-success">{activeDays} / 7 Days</Text>
        </View>
      </View>

      {/* Bar Chart */}
      <View className="h-[80px] flex-row items-end justify-between border-b border-border pb-0">
        {WEEKLY_DATA.map((item) => (
          <View
            key={item.day}
            className={`w-[38px] rounded-t-lg ${item.active ? "bg-primary" : "bg-border"}`}
            style={{ height: item.height }}
          />
        ))}
      </View>

      <View className="mt-2 flex-row justify-between">
        {WEEKLY_DATA.map((item) => (
          <Text
            key={item.day}
            className="w-[38px] text-center text-[11px] font-semibold text-text-muted"
          >
            {item.day}
          </Text>
        ))}
      </View>
    </View>
  )
}
