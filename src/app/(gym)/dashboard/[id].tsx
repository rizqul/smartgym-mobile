import { AuthButton } from "@/components/auth/authButton"
import PlanConfirmationCard from "@/components/gym/membership/membershhipPlanConfirmation"
import PaymentSection from "@/components/gym/payment/paymentSection"
import HeaderNavigation from "@/components/gym/templates/headerNavigation"
import { buyMembership } from "@/service/membership.service"
import { RootState } from "@/store/store"
import { BankId, PaymentMethodId } from "@/type/payment.type"
import { router, useLocalSearchParams } from "expo-router"
import React, { useState } from "react"
import { ScrollView, Text, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useSelector } from "react-redux"

const membershipConfirm = () => {
  const { id }: { id: string } = useLocalSearchParams()
  const { result } = useSelector((state: RootState) => state.membership)
  const [paymentId, setPaymentId] = useState<PaymentMethodId | "">("OTHER_QRIS")
  const [bankId, setBankId] = useState<BankId | "">("")
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
      const paymentType = paymentId !== "" ? paymentId : bankId
      const data = await buyMembership(id, paymentType)
      const { redirectUrl } = data
      router.push({
        pathname: "/(gym)/dashboard/paymentScreen",
        params: { paymentUrl: redirectUrl, type: "membership" }
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
          <View className="gap-4 px-6 py-4">
            <View className="gap-3">
              <Text className="font-inter text-3xl font-bold text-text-primary">Konfirmasi Paket</Text>
              <Text className="font-inter text-xs font-normal text-text-secondary">
                Satu langkah lagi menuju rutinitas latihanmu. Periksa pilihanmu sebelum membayar.
              </Text>
            </View>
            <View className="gap-5">
              <Text className="text-text-primary ">Paket Pilihanmu</Text>
              <PlanConfirmationCard
                badge={data?.type!}
                name={data?.name!}
                description={data?.description!}
                price={`Rp ${data?.price}`}
                duration={`${data?.duration} hari`}
              />
            </View>
            <PaymentSection
              summary={{
                planName: data?.name!,
                price: `Rp ${data?.price}`,
                duration: `${data?.duration} hari`,
                total: `${data?.price}`
              }}
              onSelectMethod={(id) => {
                setPaymentId(id)
                setBankId("")
              }}
              onSelectBank={(id) => {
                setBankId(id)
                setPaymentId("")
              }}
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
