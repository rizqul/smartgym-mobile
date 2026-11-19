import { AuthButton } from "@/components/auth/authButton"
import PaymentSection from "@/components/gym/membership/membershipPaymentSection"
import PlanCard from "@/components/gym/membership/membershipPlanCard"
import HeaderNavigation from "@/components/gym/templates/headerNavigation"
import { buyMembership } from "@/service/membership.service"
import { RootState } from "@/store/store"
import * as Crypto from "expo-crypto"
import { router, useLocalSearchParams } from "expo-router"
import React from "react"
import { ScrollView, Text, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useSelector } from "react-redux"

const membershipConfirm = () => {
  const { id }: { id: string } = useLocalSearchParams()
  const { result } = useSelector((state: RootState) => state.membership)
  const weekly = result?.WEEKLY?.find((val) => val.id === id)
  const monthly = result?.MONTHLY?.find((val) => val.id === id)
  const yearly = result?.YEARLY?.find((val) => val.id === id)
  let data = null

  if (weekly) {
    data = weekly
  } else if (monthly) {
    data = monthly
  } else {
    data = yearly
  }

  const handlePay = async () => {
    try {
      const transactionId = Crypto.randomUUID()
      const paymentUrl = await buyMembership(transactionId, id)
      console.log(paymentUrl)
      router.push({
        pathname: "/(gym)/dashboard/paymentScreen",
        params: { paymentUrl }
      })
    } catch (err: any) {
      console.log(err.response?.status, err.response?.data)
    }
  }

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
                badge={data?.type!}
                status="Aktif"
                name={data?.name!}
                description={data?.description!}
                price={`Rp ${data?.price}`}
                duration={`${data?.duration} hari`}
                buttonLabel="Pilih Paket"
              />
            </View>
            <PaymentSection
              summary={{
                planName: data?.name!,
                price: `Rp ${data?.price}`,
                duration: `${data?.duration} hari`,
                total: `${data?.price}`
              }}
              onSelectMethod={(id) => console.log(id)}
            />
            <View className="items-center">
              <AuthButton
                onPress={handlePay}
                label="Lanjutkan Pembayaran"
              />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  )
}

export default membershipConfirm
