import { AuthButton } from "@/components/auth/authButton"
import PaymentSection from "@/components/gym/membership/membershipPaymentSection"
import PlanCard from "@/components/gym/membership/membershipPlanCard"
import HeaderNavigation from "@/components/gym/templates/headerNavigation"
import React from "react"
import { ScrollView, Text, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

const membershipConfirm = () => {
  return (
    <View className="items-center bg-background">
      <SafeAreaView>
        <HeaderNavigation label="Kembali" />
        <ScrollView showsVerticalScrollIndicator={false}>
          <View className="gap-6 px-6 py-4">
            <View className="gap-3">
              <Text className="font-inter text-3xl font-bold text-text-primary">Konfirmasi Paket</Text>
              <Text className="font-inter text-xs font-normal text-text-secondary">
                Satu langkah lagi menuju rutinitas latihanmu. Periksa pilihanmu sebelum membayar.
              </Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-[11px] font-semibold text-[#FFAE77]">01 Konfirmasi</Text>
              <Text className="text- text-[11px] font-semibold text-[#A59F9B]">02 Pembayaran</Text>
            </View>
            <View className="gap-5">
              <Text className="text-text-primary ">Paket Pilihanmu</Text>
              <PlanCard
                badge="MINGGUAN"
                status="Aktif"
                name="Paket Mingguan"
                description="Coba dulu ritme latihanmu, cocok untuk memulai dengan komitmen ringan."
                price="Rp 99.000"
                duration="7 hari"
                buttonLabel="Pilih Paket"
              />
            </View>
            <PaymentSection
              summary={{
                planName: "Daily Pass",
                price: "Rp 50.000",
                duration: "1 hari",
                total: "Rp 50.000"
              }}
              onSelectMethod={(id) => console.log(id)}
            />
            <View className="items-center">
              <AuthButton label="Lanjutkan Pembayaran" />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  )
}

export default membershipConfirm
