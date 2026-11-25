import MembershipActiveCard from "@/components/gym/membership/membershipActiveCard"
import { useAuth } from "@/context/authContext"
import { ChatAdminWA } from "@/utils/chatAdminHelper"
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"
import { useRouter } from "expo-router"
import React, { useState } from "react"
import { Image, Modal, Pressable, ScrollView, StatusBar, Text, TouchableOpacity, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

export default function Profile() {
  const router = useRouter()
  const { logout, user } = useAuth()
  const [showAlert, setShowAlert] = useState(false)
  const accountCreatedDate = new Date(user?.createdAt!)
  const month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  const accountCreatedMonth = month[accountCreatedDate.getMonth()]
  const accountCreatedYear = accountCreatedDate.getFullYear()

  const handleLogout = async () => {
    setShowAlert(false)
    await logout()
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <StatusBar barStyle="light-content" />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="flex gap-5 px-5 pb-10 pt-3">
          {/* ================= USER CARD (GRADIENT) ================= */}
          <LinearGradient
            colors={["#2E1A14", "#1A1D24", "#1A1D24"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="w-screen border border-border"
            style={{ padding: 16, borderRadius: 16 }}
          >
            {/* Top Row: Avatar & Info */}
            <View className="flex items-center gap-4">
              <View className="relative">
                <Image
                  source={{ uri: user?.profileUrl }}
                  className="h-[100px] w-[100px] rounded-full border-2 border-border/50"
                />
                <TouchableOpacity
                  onPress={() => router.push("/(gym)/profile/editProfile")}
                  className="absolute -right-1 bottom-2 rounded-md border border-border bg-card p-1"
                >
                  <Ionicons
                    name="pencil"
                    size={16}
                    color="#B8BDC7"
                  />
                </TouchableOpacity>
              </View>
              <View className="items-center gap-2">
                <View className="flex-row items-center justify-center gap-2">
                  <Text className="font-inter text-2xl font-bold text-text-primary">{user?.name}</Text>
                </View>
                <Text className="font-inter text-lg text-text-secondary">{user?.email}</Text>
                <View className="flex-row items-center justify-between gap-2">
                  <View className="items-center rounded-md bg-[#493522] px-[6px] py-[4px]">
                    <Text className="font-inter text-xs text-[#FFC178]">MEMBER</Text>
                  </View>
                  <View className="h-[7px] w-[7px] rounded-full bg-[#777E8A]"></View>
                  <Text className="font-inter text-sm text-[#777E8A]">{`Since ${accountCreatedMonth} ${accountCreatedYear}`}</Text>
                </View>
              </View>
            </View>
          </LinearGradient>

          {/* ================= ACTIVE PLAN CARD ================= */}
          <MembershipActiveCard
            planName="SmartGym Elite Gold"
            billingLabel="ANNUAL"
            memberTier="Member"
            validUntil="Dec 18, 2025"
            autoRenew={false}
            benefits={[
              {
                icon: "meeting-room",
                title: "24/7 Access to All Clubs",
                description: "Ready-to-use fast-pass QR turnstile",
                tone: "primary"
              },
              {
                icon: "smart-toy",
                title: "AI Neural Trainer & Plan",
                description: "Daily rep and goal adjustments",
                tone: "info"
              }
            ]}
            onRenewPress={() => {}}
          />

          {/* ================= HISTORY ================= */}
          <View className="">
            <View className="mb-4 flex-row items-center gap-2">
              <Ionicons
                name="shield-checkmark"
                size={20}
                color="#FF8A33"
              />
              <Text className="font-inter text-lg font-bold text-text-primary">History</Text>
            </View>

            <View className="overflow-hidden rounded-2xl border border-border bg-card">
              {/* Item 1 */}
              <TouchableOpacity
                className="flex-row items-center border-b border-border/50 p-4"
                onPress={() => {
                  router.push("/(gym)/profile/historyCheckIn")
                }}
              >
                <View className="mr-3 h-10 w-10 items-center justify-center rounded-full bg-surface">
                  <MaterialCommunityIcons
                    name="calendar-check-outline"
                    size={20}
                    color="#B8BDC7"
                  />
                </View>
                <View className="flex-1">
                  <Text className="mb-1 font-inter text-sm font-semibold text-text-primary">Check-in History</Text>
                  <Text className="font-inter text-[11px] text-text-secondary">View your gym visit history</Text>
                </View>
                <Ionicons
                  name="chevron-forward"
                  size={16}
                  color="#B8BDC7"
                />
              </TouchableOpacity>

              {/* Item 2 */}
              <TouchableOpacity
                className="flex-row items-center p-4"
                onPress={() => router.push("/(gym)/profile/historyTransaction")}
              >
                <View className="mr-3 h-10 w-10 items-center justify-center rounded-full bg-surface">
                  <MaterialCommunityIcons
                    name="receipt"
                    size={20}
                    color="#B8BDC7"
                  />
                </View>
                <View className="flex-1">
                  <Text className="mb-1 font-inter text-sm font-semibold text-text-primary">Transaction History</Text>
                  <Text className="font-inter text-[11px] text-text-secondary">View your payment and membership history</Text>
                </View>
                <Ionicons
                  name="chevron-forward"
                  size={16}
                  color="#B8BDC7"
                />
              </TouchableOpacity>
            </View>
          </View>
          {/* ================= SECURITY & SUPPORT ================= */}
          <View className="">
            <View className="mb-4 flex-row items-center gap-2">
              <Ionicons
                name="shield-checkmark"
                size={20}
                color="#FF8A33"
              />
              <Text className="font-inter text-lg font-bold text-text-primary">Security & Support</Text>
            </View>

            <View className="overflow-hidden rounded-2xl border border-border bg-card">
              {/* Item 1 */}
              <TouchableOpacity
                onPress={() => {
                  router.push("/(gym)/profile/change-password")
                }}
                className="flex-row items-center border-b border-border/50 p-4"
              >
                <View className="mr-3 h-10 w-10 items-center justify-center rounded-full bg-surface">
                  <Ionicons
                    name="key-outline"
                    size={20}
                    color="#B8BDC7"
                  />
                </View>
                <View className="flex-1">
                  <Text className="mb-1 font-inter text-sm font-semibold text-text-primary">Change Password</Text>
                  <Text className="font-inter text-[11px] text-text-secondary">Update your current password</Text>
                </View>
                <Ionicons
                  name="chevron-forward"
                  size={16}
                  color="#B8BDC7"
                />
              </TouchableOpacity>

              {/* Item 2 */}
              <TouchableOpacity
                onPress={ChatAdminWA}
                className="flex-row items-center p-4"
              >
                <View className="mr-3 h-10 w-10 items-center justify-center rounded-full bg-surface">
                  <Ionicons
                    name="headset-outline"
                    size={20}
                    color="#B8BDC7"
                  />
                </View>
                <View className="flex-1">
                  <Text className="mb-1 font-inter text-sm font-semibold text-text-primary">Gym Support & Admin Chat</Text>
                  <Text className="font-inter text-[11px] text-text-secondary">
                    Ask about programs, manage bookings, or request refunds
                  </Text>
                </View>
                <Ionicons
                  name="chevron-forward"
                  size={16}
                  color="#B8BDC7"
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* ================= LOGOUT & FOOTER ================= */}
          <TouchableOpacity
            onPress={() => setShowAlert(true)}
            className="flex-row items-center justify-center gap-2 rounded-2xl border border-border bg-card py-4"
          >
            <Ionicons
              name="log-out-outline"
              size={20}
              color="#FF8A33"
            />
            <Text className="font-inter text-sm font-semibold text-primary">Log Out Of SmartGym</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <Modal
        visible={showAlert}
        transparent
        animationType="fade"
        onRequestClose={() => setShowAlert(false)}
      >
        <Pressable
          className="flex-1 items-center justify-center bg-black/70 px-6"
          onPress={() => setShowAlert(false)}
        >
          <Pressable className="flex h-[150] w-[300] items-center justify-center gap-8 rounded-xl border border-border bg-card p-5">
            <Text className="mb-1 text-center font-inter text-xl font-bold leading-8 tracking-widest text-text-primary">
              Are you sure you want to log out?
            </Text>
            <View className="flex-row gap-3">
              <TouchableOpacity
                className="flex-1 items-center rounded-xl border border-border bg-surface py-3"
                onPress={() => setShowAlert(false)}
              >
                <Text className="font-inter text-sm font-semibold text-text-secondary">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-1 items-center rounded-xl bg-primary py-3"
                onPress={() => handleLogout()}
              >
                <Text className="font-inter text-sm font-bold text-white">Log Out</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  )
}
