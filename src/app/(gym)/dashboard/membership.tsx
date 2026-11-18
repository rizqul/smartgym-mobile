import MembershipActiveCard from "@/components/gym/membership/membershipActiveCard"
import MembershipConsultCard from "@/components/gym/membership/membershipConsultCard"
import MembershipHeader from "@/components/gym/membership/membershipHeader"
import MembershipPaymentInfo from "@/components/gym/membership/membershipPaymentInfo"
import PlanCard from "@/components/gym/membership/membershipPlanCard"
import HeaderNavigation from "@/components/gym/templates/headerNavigation"

import React from "react"
import { ScrollView, Text, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

const membership = () => {
  return (
    <>
      <View className="flex-1 items-center bg-background pt-3">
        <SafeAreaView>
          <HeaderNavigation label="Berlangganan" />
          <ScrollView showsVerticalScrollIndicator={false}>
            <View className="items-center gap-5  px-6 py-4">
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
                <Text className="text-sm leading-6 text-text-warm">Sesuaikan komitmen latihan dengan target kebugaranmu</Text>
              </View>
              <View className="items-center gap-4">
                <PlanCard
                  badge="MINGGUAN"
                  status="Aktif"
                  name="Paket Mingguan"
                  description="Coba dulu ritme latihanmu, cocok untuk memulai dengan komitmen ringan."
                  price="Rp 99.000"
                  duration="7 hari"
                  buttonLabel="Pilih Paket"
                />

                <PlanCard
                  variant="popular"
                  badge="BULANAN"
                  status="Aktif"
                  name="Paket Bulanan"
                  description="Bangun kebiasaan latihan yang konsisten, satu bulan setiap langkah."
                  price="Rp 299.000"
                  duration="30 hari"
                  buttonLabel="Pilih Paket"
                />

                <PlanCard
                  badge="TAHUNAN"
                  status="Aktif"
                  name="Paket Tahunan"
                  description="Investasi jangka panjang untuk progres yang terus berkembang sepanjang tahun."
                  price="Rp 2.499.000"
                  duration="365 hari"
                  buttonLabel="Pilih Paket"
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
