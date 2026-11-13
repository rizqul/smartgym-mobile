import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"
import React from "react"
import { ScrollView, StatusBar, Text, TouchableOpacity, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

// Core
export default function Dashboard() {
  return (
    <SafeAreaView className="flex bg-background">
      <StatusBar barStyle="light-content" />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="flex gap-5 px-5 pb-10 pt-3">
          {/* HEADER SECTION */}
          <View>
            <View className="flex flex-row items-center justify-between">
              <Text className="text-lg font-extrabold text-primary">
                SMART
                <Text className="text-text-muted">GYM</Text>
              </Text>
              <TouchableOpacity className="rounded-2xl bg-card px-3 py-[6px]">
                <Text className="text-xs font-bold text-white">MEMBER HOME</Text>
              </TouchableOpacity>
            </View>

            <View className="flex-row items-start justify-between">
              <View>
                <Text className="mb-1 text-2xl font-bold text-text-primary">
                  Hello, <Text className="text-text-subdued">Dhafin</Text> 👋
                </Text>
                <Text className="text-xs font-medium text-secondary">Gold Member • Active until 18 Dec 2025</Text>
              </View>
            </View>
          </View>

          {/* MEMBERSHIP CARD COMPONENT */}
          <MembershipCard />

          {/* ACTION BUTTONS */}
          <View className="flex-row gap-4">
            <TouchableOpacity className="border-border flex-1 items-center justify-center gap-2 rounded-2xl border bg-surface py-4">
              <MaterialCommunityIcons
                name="qrcode-scan"
                size={24}
                color="#FFD166"
              />
              <Text className="text-xs font-semibold text-text-primary">Check-In</Text>
            </TouchableOpacity>

            <TouchableOpacity className="border-border flex-1 items-center justify-center gap-2 rounded-2xl border bg-surface py-4">
              <Ionicons
                name="desktop-outline"
                size={24}
                color="#60A5FA"
              />
              <Text className="text-xs font-semibold text-text-primary">Packages</Text>
            </TouchableOpacity>
          </View>

          {/* STATS CARDS */}
          <View className="border-border items-center rounded-[20px] border bg-surface p-5">
            <Text className="text-text-subdued text-xs font-semibold">Gym Time</Text>
            <Ionicons
              name="stopwatch-outline"
              size={28}
              color="#60A5FA"
              className="my-2"
            />
            <Text className="text-2xl font-bold text-text-primary">
              48<Text className="text-text-subdued text-sm">m</Text>
            </Text>
            <Text className="text-info mt-1 text-[10px] font-semibold">Target 50m</Text>
          </View>

          <View className="border-border items-center rounded-[20px] border bg-surface p-5">
            <Text className="text-text-subdued text-xs font-semibold">Streak</Text>
            <Ionicons
              name="flame"
              size={28}
              color="#FFD166"
              className="my-2"
            />
            <Text className="text-2xl font-bold text-text-primary">
              6 <Text className="text-text-subdued text-sm">Days</Text>
            </Text>
            <Text className="mt-1 text-[10px] font-semibold text-secondary">Personal Best!</Text>
          </View>

          {/* WEEKLY ATTENDANCE */}
          <WeeklyAttendanceCard />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

// Card Membership
const MembershipCard = () => {
  return (
    <LinearGradient
      colors={["#2E1A14", "#1A1D24", "#1A1D24"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      className="border-border overflow-hidden rounded-[20px] border"
      style={{ padding: 18 }}
    >
      {/* Card Header */}
      <View className="mb-5 flex-row items-start justify-between">
        <View className="flex-row items-center gap-2.5">
          <View className="h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Ionicons
              name="flash"
              size={16}
              color="#FFFFFF"
            />
          </View>
          <View>
            <Text className="text-sm font-extrabold tracking-[0.5px] text-text-primary">SMARTGYM</Text>
            <Text className="text-text-subdued text-[10px] font-semibold tracking-[0.5px]">ELITE ACCESS</Text>
          </View>
        </View>

        <View className="flex-row items-center gap-1.5 rounded-xl bg-success/15 px-2 py-1">
          <View className="h-1.5 w-1.5 rounded-full bg-success" />
          <Text className="text-[10px] font-bold text-success">ACTIVE</Text>
        </View>
      </View>

      {/* Card Middle */}
      <View className="mb-5 flex-row items-center justify-between">
        <View>
          <Text className="text-text-muted mb-1 text-[10px] font-semibold">MEMBER ID</Text>
          <Text className="text-[22px] font-bold tracking-[1px] text-text-primary">SG-88294</Text>
        </View>

        <TouchableOpacity className="rounded-lg bg-white/5 px-3 py-1.5">
          <Text className="text-xs font-semibold text-primary">Fast Pass</Text>
        </TouchableOpacity>
      </View>

      {/* Card Footer */}
      <View className="flex-row items-end justify-between">
        <View>
          <Text className="text-text-muted mb-1 text-[10px] font-semibold">Cardholder</Text>
          <Text className="text-xs font-semibold text-text-primary">DHAFIN RIZKY</Text>
        </View>

        <View className="items-end">
          <Text className="text-text-muted mb-1 text-[10px] font-semibold">Expires</Text>
          <Text className="text-xs font-semibold text-secondary">18 / 12 / 2025</Text>
        </View>
      </View>
    </LinearGradient>
  )
}

// Weekly Attendance
const WeeklyAttendanceCard = () => {
  return (
    <View className="border-border rounded-[20px] border bg-surface p-5">
      <View className="mb-5 flex-row items-start justify-between">
        <View>
          <Text className="mb-1 text-base font-bold text-text-primary">Weekly Attendance</Text>
          <Text className="text-text-subdued text-xs">5 out of 7 days logged</Text>
        </View>

        <View className="rounded-lg bg-success/15 px-2 py-1">
          <Text className="text-[10px] font-semibold text-success">+18% vs Last Week</Text>
        </View>
      </View>

      {/* Bar Chart */}
      <View className="h-[90px] flex-row items-end justify-between">
        <View className="items-center gap-2">
          <View className="h-[60px] w-8 rounded-md bg-primary" />
          <Text className="text-text-muted text-[10px] font-semibold">M</Text>
        </View>

        <View className="items-center gap-2">
          <View className="h-[60px] w-8 rounded-md bg-primary" />
          <Text className="text-text-muted text-[10px] font-semibold">T</Text>
        </View>

        <View className="items-center gap-2">
          <View className="bg-border h-[15px] w-8 rounded-md" />
          <Text className="text-text-muted text-[10px] font-semibold">W</Text>
        </View>

        <View className="items-center gap-2">
          <View className="h-[60px] w-8 rounded-md bg-primary" />
          <Text className="text-text-muted text-[10px] font-semibold">T</Text>
        </View>

        <View className="items-center gap-2">
          <View className="h-[60px] w-8 rounded-md bg-primary" />
          <Text className="text-text-muted text-[10px] font-semibold">F</Text>
        </View>

        <View className="items-center gap-2">
          <View className="bg-highlight h-[45px] w-8 rounded-md" />
          <Text className="text-text-muted text-[10px] font-semibold">S</Text>
        </View>

        <View className="items-center gap-2">
          <View className="bg-border h-[15px] w-8 rounded-md" />
          <Text className="text-text-muted text-[10px] font-semibold">S</Text>
        </View>
      </View>
    </View>
  )
}
