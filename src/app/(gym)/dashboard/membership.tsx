import MembershipConsultCard from "@/components/gym/membership/membershipConsultCard"
import MembershipHeader from "@/components/gym/membership/membershipHeader"
import MembershipPaymentInfo from "@/components/gym/membership/membershipPaymentInfo"
import PlanCard from "@/components/gym/membership/membershipPlanCard"
import HeaderNavigation from "@/components/gym/templates/headerNavigation"
import { fetchMemberships } from "@/store/slice/membershipSlice"
import { AppDispatch, RootState } from "@/store/store"
import { router } from "expo-router"

import { ChatAdminWA } from "@/utils/chatAdminHelper"
import React, { useEffect } from "react"
import { ScrollView, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useDispatch, useSelector } from "react-redux"

const Membership = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { result } = useSelector((state: RootState) => state.membership)
  const weekly = result?.WEEKLY
  const monthly = result?.MONTHLY
  const yearly = result?.YEARLY

  useEffect(() => {
    void dispatch(fetchMemberships())
  }, [])

  return (
    <SafeAreaView className="flex-1 bg-background font-inter">
      <HeaderNavigation label="Membership" />
      <ScrollView
        className="font-inter"
        showsVerticalScrollIndicator={false}
      >
        <View className="gap-5 px-6 py-4 font-inter">
          <MembershipHeader />

          <MembershipPaymentInfo
            provider="Powered by Midtrans"
            methods={[
              { label: "QRIS", tone: "primary" },
              { label: "BCA", tone: "info" },
              { label: "BNI", tone: "secondary" },
              { label: "BRI", tone: "info" },
              { label: "BSI", tone: "primary" },
              { label: "MANDIRI", tone: "secondary" },
              { label: "GOPAY", tone: "success" },
              { label: "DANA", tone: "info" },
              { label: "SHOPEEPAY", tone: "primary" },
              { label: "SEABANK", tone: "danger" }
            ]}
          />
          <View className="items-center gap-4 font-inter">
            {weekly?.map((val) => {
              return (
                <PlanCard
                  variant="popular"
                  key={val.id}
                  badge={val.type}
                  status="Active"
                  name={val.name}
                  description={val.description}
                  price={`Rp ${val.price.toString()}`}
                  duration={`${val.duration} days`}
                  buttonLabel="Select Plan"
                  onPress={() =>
                    router.push({
                      pathname: "/(gym)/dashboard/membershipConfirm",
                      params: { id: val.id }
                    })
                  }
                />
              )
            })}
            {monthly?.map((val) => (
              <PlanCard
                key={val.id}
                badge={val.type}
                status="Active"
                name={val.name}
                description={val.description}
                price={`Rp ${val.price.toString()}`}
                duration={`${val.duration} days`}
                buttonLabel="Select Plan"
                onPress={() =>
                  router.push({
                    pathname: "/(gym)/dashboard/membershipConfirm",
                    params: { id: val.id }
                  })
                }
              />
            ))}
            {yearly?.map((val) => (
              <PlanCard
                key={val.id}
                badge={val.type}
                status="Active"
                name={val.name}
                description={val.description}
                price={`Rp ${val.price.toString()}`}
                duration={`${val.duration} days`}
                buttonLabel="Select Plan"
                onPress={() =>
                  router.push({
                    pathname: "/(gym)/dashboard/membershipConfirm",
                    params: { id: val.id }
                  })
                }
              />
            ))}
          </View>
        </View>
      </ScrollView>
      <MembershipConsultCard onPress={ChatAdminWA} />
    </SafeAreaView>
  )
}

export default Membership
