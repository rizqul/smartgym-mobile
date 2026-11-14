import MembershipActiveCard from "@/components/membership/membershipActiveCard"
import MembershipConsultCard from "@/components/membership/membershipConsultCard"
import MembershipHeader from "@/components/membership/membershipHeader"
import MembershipPaymentInfo from "@/components/membership/membershipPaymentInfo"
import PlanCard from "@/components/membership/membershipPlanCard"
import { Ionicons } from "@expo/vector-icons"
import { router } from "expo-router"

import React from "react"
import { ScrollView, Text, TouchableOpacity, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

const membership = () => {
  return (
    <>
      <View className="flex-1 items-center bg-background pt-3">
        <SafeAreaView>
          <View className="w-full flex-row items-center gap-4 border-b border-border/40  pb-4">
            <TouchableOpacity
              onPress={() => router.back()}
              className="h-10 w-10 items-center justify-center rounded-xl border border-border/50 bg-surface"
            >
              <Ionicons
                name="chevron-back"
                size={20}
                color="white"
              />
            </TouchableOpacity>
            <Text className="text-xl font-bold text-text-primary">Membership</Text>
          </View>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View className="items-center gap-5">
              <MembershipHeader />
              <MembershipActiveCard
                planName="SmartGym Elite Gold"
                billingLabel="TAHUNAN"
                memberTier="Gold Member"
                validUntil="18 Des 2025"
                startDate="18 Des 2024"
                daysUsed={157}
                totalDays={365}
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
                onRenewPress={() => {}}
              />
              <View className="w-[350]">
                <Text className="text-xl font-bold text-text-primary">Pilih Siklus Berlangganan</Text>
                <Text className="text-text-warm text-sm leading-6">Sesuaikan komitmen latihan dengan target kebugaranmu</Text>
              </View>
              <View className="items-center gap-4">
                <PlanCard
                  tier="ENTRY TIER"
                  name="Basic Starter"
                  description="Ideal untuk pemula yang ingin mulai kondisi."
                  price="Rp 299.000"
                  period="/bulan"
                  features={["Akses single club", "Jam operasional reguler"]}
                  buttonLabel="Pilih Paket"
                  onPress={() => {}}
                />

                <PlanCard
                  variant="popular"
                  badge="MOST POPULAR"
                  tier="STRATEGI REKOMENDASI"
                  name="Pro Athlete"
                  originalPrice="Rp 622.000"
                  discountLabel="Hemat 20%"
                  price="Rp 499.000"
                  period="/bulan"
                  description="..."
                  features={["..."]}
                  buttonLabel="Upgrade Sekarang"
                />

                <PlanCard
                  tier="ENTRY TIER"
                  name="Basic Starter"
                  description="Ideal untuk pemula yang ingin mulai kondisi."
                  price="Rp 299.000"
                  period="/bulan"
                  features={["Akses single club", "Jam operasional reguler"]}
                  buttonLabel="Pilih Paket"
                  onPress={() => {}}
                />
              </View>
              <MembershipPaymentInfo
                provider="Powered by Midtrans"
                methods={[
                  { label: "GoPay", tone: "info" },
                  { label: "QRIS", tone: "primary" },
                  { label: "BCA", tone: "info" },
                  { label: "MANDIRI", tone: "primary" },
                  { label: "VISA/MC", tone: "primary" }
                ]}
              />
              <MembershipConsultCard />
            </View>
          </ScrollView>
        </SafeAreaView>
      </View>
    </>
  )
}

export default membership
