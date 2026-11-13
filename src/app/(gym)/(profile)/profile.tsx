import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"
import React from "react"
import { Image, ScrollView, StatusBar, Text, TouchableOpacity, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

export default function Profile() {
  return (
    <SafeAreaView className="flex-1 bg-background">
      <StatusBar barStyle="light-content" />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="flex gap-5 px-5 pb-10 pt-3">
          {/* ================= HEADER SECTION ================= */}
          {/* <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-3">
              <View className="relative">
                <Image
                  source={{ uri: "https://i.pravatar.cc/150?img=11" }}
                  className="border-border h-12 w-12 rounded-full border"
                />
                <View className="absolute bottom-0 right-0 rounded-full border-2 border-background bg-primary p-1">
                  <MaterialCommunityIcons
                    name="crown"
                    size={10}
                    color="white"
                  />
                </View>
              </View>
              <View>
                <Text className="text-lg font-bold text-text-primary">Profile & Settings</Text>
                <Text className="text-xs text-text-secondary">Pro Member • Level 14</Text>
              </View>
            </View>
            <TouchableOpacity className="h-10 w-10 items-center justify-center rounded-xl bg-surface">
              <Ionicons
                name="notifications-outline"
                size={22}
                color="#FF8A33"
              />
            </TouchableOpacity>
          </View> */}

          {/* ================= USER CARD (GRADIENT) ================= */}
          <LinearGradient
            colors={["#2E1A14", "#1A1D24", "#1A1D24"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="border-border border"
            style={{ padding: 16, borderRadius: 16 }}
          >
            {/* Top Row: Avatar & Info */}
            <View className="mb-5 flex-row items-center gap-4">
              <View className="relative">
                <Image
                  source={{ uri: "https://i.pravatar.cc/150?img=11" }}
                  className="border-border/50 h-16 w-16 rounded-xl border-2"
                />
                <TouchableOpacity className="border-border absolute -bottom-1 -right-1 rounded-md border bg-card p-1">
                  <Ionicons
                    name="pencil"
                    size={12}
                    color="#B8BDC7"
                  />
                </TouchableOpacity>
              </View>
              <View className="flex-1">
                <View className="mb-1 flex-row items-center gap-2">
                  <Text className="text-lg font-bold text-text-primary">Dhafin Rizky</Text>
                  <View className="flex-row items-center gap-1 rounded-full bg-secondary/20 px-2 py-0.5">
                    <MaterialCommunityIcons
                      name="crown"
                      size={10}
                      color="#FFD166"
                    />
                    <Text className="text-[10px] font-bold text-secondary">GOLD TIER</Text>
                  </View>
                </View>
                <Text className="text-xs text-text-secondary">ID: SG-88294 • Sejak Jan 2023</Text>
              </View>
            </View>

            {/* Stats Row (Tinggi, Berat, Body Fat) */}
            <View className="mb-4 flex-row justify-between">
              <View className="border-border/50 mr-2 flex-1 items-center rounded-xl border bg-background/50 p-3">
                <Text className="mb-1 text-[10px] font-semibold uppercase text-text-secondary">Tinggi</Text>
                <Text className="text-lg font-bold text-text-primary">
                  178 <Text className="text-xs font-normal">cm</Text>
                </Text>
              </View>
              <View className="border-border/50 mr-2 flex-1 items-center rounded-xl border bg-background/50 p-3">
                <Text className="mb-1 text-[10px] font-semibold uppercase text-text-secondary">Berat</Text>
                <Text className="text-lg font-bold text-text-primary">
                  74.5 <Text className="text-xs font-normal">kg</Text>
                </Text>
              </View>
              <View className="border-border/50 flex-1 items-center rounded-xl border bg-background/50 p-3">
                <Text className="mb-1 text-[10px] font-semibold uppercase text-text-secondary">Body Fat</Text>
                <Text className="text-lg font-bold text-primary">
                  13.8<Text className="text-xs font-normal">%</Text>
                </Text>
              </View>
            </View>

            {/* Sync Status */}
            <View className="mb-5 flex-row items-center justify-between">
              <View className="flex-row items-center gap-1.5">
                <MaterialCommunityIcons
                  name="sync"
                  size={14}
                  color="#B8BDC7"
                />
                <Text className="text-xs text-text-secondary">InBody Sync: Kemarin, 19:40</Text>
              </View>
              <TouchableOpacity>
                <Text className="text-xs font-semibold text-text-primary underline">Perbarui Data</Text>
              </TouchableOpacity>
            </View>

            {/* Action Buttons */}
            <View className="flex-row gap-3">
              <TouchableOpacity className="border-border flex-1 flex-row items-center justify-center gap-2 rounded-xl border bg-card py-3">
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
            </View>
          </LinearGradient>

          {/* ================= ACTIVE PLAN CARD ================= */}
          <View className="border-border rounded-2xl border bg-card p-5">
            <View className="mb-4 flex-row items-start justify-between">
              <Text className="text-[10px] font-bold uppercase tracking-widest text-text-secondary">Active Plan</Text>
              <View className="flex-row items-center gap-1 rounded-md bg-primary/20 px-2 py-1">
                <View className="h-1.5 w-1.5 rounded-full bg-primary" />
                <Text className="text-[10px] font-bold text-primary">Aktif</Text>
              </View>
            </View>

            <Text className="mb-4 text-xl font-bold text-text-primary">SmartGym{"\n"}Pro Athlete</Text>

            <View className="border-border/50 mb-5 flex-row items-center justify-between rounded-xl border bg-surface p-3">
              <Text className="text-xs text-text-secondary">
                Masa Berlaku: <Text className="font-semibold text-text-primary">24 Mei 2025</Text>
              </Text>
              <Text className="text-xs font-semibold text-primary">364 Hari Tersisa</Text>
            </View>

            <Text className="mb-3 text-[10px] font-bold uppercase tracking-wider text-text-secondary">Hak Istimewa Paket:</Text>

            {/* Benefits Grid */}
            <View className="mb-5 flex-row flex-wrap gap-y-3">
              <View className="w-1/2 flex-row items-center gap-2">
                <Ionicons
                  name="infinite-outline"
                  size={16}
                  color="#FF8A33"
                />
                <Text className="text-xs text-text-primary">Akses 24/7 Nasional</Text>
              </View>
              <View className="w-1/2 flex-row items-center gap-2">
                <MaterialCommunityIcons
                  name="brain"
                  size={16}
                  color="#FF8A33"
                />
                <Text className="text-xs text-text-primary">AI Neural Copilot</Text>
              </View>
              <View className="w-1/2 flex-row items-center gap-2">
                <MaterialCommunityIcons
                  name="account-details"
                  size={16}
                  color="#FF8A33"
                />
                <Text className="text-xs text-text-primary">InBody VIP Unlimited</Text>
              </View>
              <View className="w-1/2 flex-row items-center gap-2">
                <MaterialCommunityIcons
                  name="dumbbell"
                  size={16}
                  color="#FF8A33"
                />
                <Text className="text-xs text-text-primary">4x Free Personal Trainer</Text>
              </View>
            </View>

            <TouchableOpacity className="bg-border mb-3 flex-row items-center justify-between rounded-xl px-4 py-3">
              <View className="flex-row items-center gap-2">
                <Ionicons
                  name="swap-vertical"
                  size={16}
                  color="white"
                />
                <Text className="text-sm font-semibold text-text-primary">Kelola Paket / Perpanjang</Text>
              </View>
              <Ionicons
                name="arrow-forward"
                size={16}
                color="white"
              />
            </TouchableOpacity>

            <TouchableOpacity className="flex-row items-center justify-center gap-2 rounded-xl py-3">
              <Ionicons
                name="pause-circle-outline"
                size={16}
                color="#B8BDC7"
              />
              <Text className="text-xs text-text-secondary">Freeze / Cutti Membership (Garansi 60 Hari)</Text>
            </TouchableOpacity>
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

            <View className="border-border overflow-hidden rounded-2xl border bg-card">
              {/* Item 1 */}
              <TouchableOpacity className="border-border/50 flex-row items-center border-b p-4">
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
          <TouchableOpacity className="border-border flex-row items-center justify-center gap-2 rounded-2xl border bg-card py-4">
            <Ionicons
              name="log-out-outline"
              size={20}
              color="#FF8A33"
            />
            <Text className="text-sm font-semibold text-primary">Keluar dari Akun SmartGym</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
