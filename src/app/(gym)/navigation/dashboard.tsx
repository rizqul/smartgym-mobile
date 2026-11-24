import { ActionButton } from "@/components/gym/dashboard/actionButton"
import { AiSummaryCard } from "@/components/gym/dashboard/aiSummaryCard"
import CheckinCard from "@/components/gym/dashboard/checkinCard"
import { FitnessProgressCard } from "@/components/gym/dashboard/fitnessProgressCard"
import { MembershipCard } from "@/components/gym/dashboard/membershipCard"
import { TrainerCard } from "@/components/gym/dashboard/trainerCard"
import { WeeklyActivityCard } from "@/components/gym/dashboard/weeklyActivityCard"
import { useAuth } from "@/context/authContext"
import { checkOut } from "@/service/scan.service"
import { clearActiveCheckin } from "@/store/slice/checkinSlice"
import { AppDispatch, RootState } from "@/store/store"
import { Ionicons, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons"
import { router } from "expo-router"
import React from "react"
import { Alert, ScrollView, StatusBar, Text, TouchableOpacity, View } from "react-native"
import { ALERT_TYPE, Toast } from "react-native-alert-notification"
import { SafeAreaView } from "react-native-safe-area-context"
import { useDispatch, useSelector } from "react-redux"

const COLOR_PRIMARY = "#FF7A00"
const COLOR_INFO = "#60A5FA"
const COLOR_HIGHLIGHT = "#FFD166"

// Core
export default function Dashboard() {
  const dispatch = useDispatch<AppDispatch>()
  const activeCheckin = useSelector((state: RootState) => state.checkin.activeCheckin)
  const { user } = useAuth()
  const firstName = user?.name.split(" ")[0]

  const handleCheckout = () => {
    Alert.alert("Konfirmasi", "Akhiri sesi latihan?", [
      { text: "Batal", style: "cancel" },
      {
        text: "Checkout",
        style: "destructive",
        onPress: async () => {
          try {
            await checkOut();
            dispatch(clearActiveCheckin())
            Toast.show({
              type: ALERT_TYPE.SUCCESS,
              title: "Berhasil",
              textBody: "Sesi latihan selesai."
            })
          } catch (error) {
            console.log(error)
            Toast.show({
              type: ALERT_TYPE.DANGER,
              title: "Gagal",
              textBody: "Coba lagi."
            })
          }
        }
      }
    ])
  }
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

          {/* CHECKIN CARD COMPONENT */}
          {(activeCheckin) && (
            <CheckinCard activeCheckin={activeCheckin} handleCheckout={handleCheckout} />
          )}

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
          {/* AI SUMMERY */}
          <AiSummaryCard />

          {/* TRAINER SECTION */}
          <TrainerCard onViewTrainer={() => router.push("/(gym)/navigation/trainer")} />

          {/* FITNESS PROGRESS */}
          <FitnessProgressCard />

          {/* WEEKLY ACTIVITY */}
          <WeeklyActivityCard />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

