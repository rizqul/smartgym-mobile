import MembershipActiveCard from "@/components/gym/membership/membershipActiveCard"
import { useAuth } from "@/context/authContext"
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
  const month = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"]
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
                  {/* <View className="flex-row items-center gap-1 rounded-full bg-secondary/20 px-2 py-0.5">
                  <MaterialCommunityIcons
                    name="crown"
                    size={10}
                    color="#FFD166"
                  />
                  <Text className="text-[10px] font-bold text-secondary">GOLD TIER</Text>
                </View> */}
                </View>
                <Text className="font-inter text-lg text-text-secondary">{user?.email}</Text>
                <View className="flex-row items-center justify-between gap-2">
                  <View className="items-center rounded-md bg-[#493522] px-[6px] py-[4px]">
                    <Text className="font-inter text-xs text-[#FFC178]">MEMBER</Text>
                  </View>
                  <View className="h-[7px] w-[7px] rounded-full bg-[#777E8A]"></View>
                  <Text className="font-inter text-sm text-[#777E8A]">{`Sejak ${accountCreatedMonth} ${accountCreatedYear}`}</Text>
                </View>
              </View>
            </View>

            {/* Stats Row (Tinggi, Berat, Body Fat) */}
            {/* <View className="mb-4 flex-row justify-between">
            <View className="mr-2 flex-1 items-center rounded-xl border border-border/50 bg-background/50 p-3">
              <Text className="mb-1 text-[10px] font-semibold uppercase text-text-secondary">Tinggi</Text>
              <Text className="text-lg font-bold text-text-primary">
                178 <Text className="text-xs font-normal">cm</Text>
              </Text>
            </View>
            <View className="mr-2 flex-1 items-center rounded-xl border border-border/50 bg-background/50 p-3">
              <Text className="mb-1 text-[10px] font-semibold uppercase text-text-secondary">Berat</Text>
              <Text className="text-lg font-bold text-text-primary">
                74.5 <Text className="text-xs font-normal">kg</Text>
              </Text>
            </View>
            <View className="flex-1 items-center rounded-xl border border-border/50 bg-background/50 p-3">
              <Text className="mb-1 text-[10px] font-semibold uppercase text-text-secondary">Body Fat</Text>
              <Text className="text-lg font-bold text-primary">
                13.8<Text className="text-xs font-normal">%</Text>
              </Text>
            </View>
          </View> */}

            {/* Action Buttons */}
            {/* <View className="flex-row gap-3">
            <TouchableOpacity
              className="flex-1 flex-row items-center justify-center gap-2 rounded-xl border border-border bg-card py-3"
              onPress={() => router.push("/(gym)/profile/editProfile")}
            >
              <Ionicons
                name="options-outline"
                size={16}
                color="white"
              />
              <Text className="text-xs font-semibold text-text-primary">Edit Profil</Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex-1 flex-row items-center justify-center gap-2 rounded-xl bg-primary py-3">
              <MaterialCommunityIcons
                name="qrcode-scan"
                size={16}
                color="white"
              />
              <Text className="text-xs font-bold text-white">QR Turnstile</Text>
            </TouchableOpacity>
          </View> */}
          </LinearGradient>

          {/* ================= ACTIVE PLAN CARD ================= */}
          <MembershipActiveCard
            planName="SmartGym Elite Gold"
            billingLabel="TAHUNAN"
            memberTier="Member"
            validUntil="18 Des 2025"
            autoRenew={false}
            benefits={[
              {
                icon: "meeting-room",
                title: "Akses 24/7 Seluruh Cabang (All Clubs)",
                description: "Fast-pass turnstile QR gate siap pakai",
                tone: "primary"
              },
              {
                icon: "smart-toy",
                title: "AI Neural Trainer & Plan",
                description: "Penyesuaian repetisi & target harian",
                tone: "info"
              }
            ]}
            onRenewPress={() => { }}
          />
          {/*  */}

          {/* ================= HISTORY ================= */}
          <View className="">
            <View className="mb-4 flex-row items-center gap-2">
              <Ionicons
                name="shield-checkmark"
                size={20}
                color="#FF8A33"
              />
              <Text className="text-lg font-bold text-text-primary">Riwayat</Text>
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
                  <Text className="mb-1 text-sm font-semibold text-text-primary">Riwayat Check In</Text>
                  <Text className="text-[11px] text-text-secondary">Lihat daftar kunjungan gym Anda</Text>
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
                  <Text className="mb-1 text-sm font-semibold text-text-primary">Riwayat Transaksi</Text>
                  <Text className="text-[11px] text-text-secondary">Lihat riwayat pembayaran dan paket</Text>
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
              <Text className="text-lg font-bold text-text-primary">Keamanan & Dukungan</Text>
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
                  <Text className="mb-1 text-sm font-semibold text-text-primary">Ubah Kata Sandi</Text>
                  <Text className="text-[11px] text-text-secondary">Autentikasi dua faktor aktif via SMS/Authenticator</Text>
                </View>
                <Ionicons
                  name="chevron-forward"
                  size={16}
                  color="#B8BDC7"
                />
              </TouchableOpacity>

              {/* Item 2 */}
              <TouchableOpacity className="flex-row items-center p-4">
                <View className="mr-3 h-10 w-10 items-center justify-center rounded-full bg-surface">
                  <Ionicons
                    name="headset-outline"
                    size={20}
                    color="#B8BDC7"
                  />
                </View>
                <View className="flex-1">
                  <Text className="mb-1 text-sm font-semibold text-text-primary">Concierge & Personal Trainer VIP 24/7</Text>
                  <Text className="text-[11px] text-text-secondary">Hubungi admin cabang atau konsultasi program</Text>
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
            <Text className="text-sm font-semibold text-primary">Keluar dari Akun SmartGym</Text>
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
            <Text className="mb-1 text-center text-xl font-bold text-text-primary">Yakin ingin keluar ?</Text>
            <View className="flex-row gap-3">
              <TouchableOpacity
                className="flex-1 items-center rounded-xl border border-border bg-surface py-3"
                onPress={() => setShowAlert(false)}
              >
                <Text className="text-sm font-semibold text-text-secondary">Batal</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-1 items-center rounded-xl bg-primary py-3"
                onPress={() => handleLogout()}
              >
                <Text className="text-sm font-bold text-white">Keluar</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  )
}
