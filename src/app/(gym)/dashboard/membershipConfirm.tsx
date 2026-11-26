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
import { ALERT_TYPE, Toast } from "react-native-alert-notification"
import { SafeAreaView } from "react-native-safe-area-context"
import { useSelector } from "react-redux"

const MembershipConfirm = () => {
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
      const { redirectUrl, orderId } = data
      router.replace({
        pathname: "/(gym)/dashboard/paymentScreen",
        params: { paymentUrl: redirectUrl, type: "membership", orderId }
      })
    } catch (error: any) {
      let errorMessage = "An unknown error occurred"
      let errorTitle = "Payment Failed"

      if (error.request && !error.response) {
        errorTitle = "Connection Problem"
        errorMessage = "Unable to connect to the server. Check your internet connection and make sure the server is available."
      } else if (error.response) {
        errorMessage = error.response.data?.message || "A server error occurred"
      } else if (error.message) {
        errorMessage = error.message
      }

      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: errorTitle,
        textBody: errorMessage,
        autoClose: 3000
      })
    }
  }

  return (
    <View className="items-center bg-background">
      <SafeAreaView>
        <HeaderNavigation label="Back" />
        <ScrollView showsVerticalScrollIndicator={false}>
          <View className="gap-4 px-6 py-4">
            <View className="gap-3">
              <Text className="font-inter text-3xl font-bold text-text-primary">Package Confirmation</Text>
              <Text className="font-inter text-sm font-normal text-text-secondary">
                One more step toward your workout routine. Review your choice before making a payment.
              </Text>
            </View>
            <View className="gap-5">
              <Text className="font-inter text-lg text-text-primary">Your Selected Package</Text>
              <PlanConfirmationCard
                badge={data?.type!}
                name={data?.name!}
                description={data?.description!}
                price={`Rp ${data?.price}`}
                duration={`${data?.duration} days`}
              />
            </View>
            <PaymentSection
              summary={{
                planName: data?.name!,
                price: `Rp ${data?.price}`,
                duration: `${data?.duration} days`,
                total: `${data?.price}`
              }}
              label="Active period extension"
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
                label="Continue to Payment"
              />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  )
}

export default MembershipConfirm
