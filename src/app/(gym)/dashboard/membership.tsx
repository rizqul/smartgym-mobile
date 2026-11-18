import MembershipActiveCard from "@/components/gym/membership/membershipActiveCard"
import MembershipConsultCard from "@/components/gym/membership/membershipConsultCard"
import MembershipHeader from "@/components/gym/membership/membershipHeader"
import MembershipPaymentInfo from "@/components/gym/membership/membershipPaymentInfo"
import PlanCard from "@/components/gym/membership/membershipPlanCard"
import HeaderNavigation from "@/components/gym/templates/headerNavigation"
import { fetchMemberships } from "@/store/slice/membershipSlice"
import { AppDispatch, RootState } from "@/store/store"
import { router } from "expo-router"

import React, { useEffect } from "react"
import { ScrollView, Text, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useDispatch, useSelector } from "react-redux"

const membership = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { result } = useSelector((state: RootState) => state.membership)
  const weekly = result?.WEEKLY
  const monthly = result?.MONTHLY
  const yearly = result?.YEARLY

  useEffect(() => {
    dispatch(fetchMemberships())
  }, [])

  return (
    <>
      <View className="flex-1 items-center bg-background pt-3">
        <SafeAreaView>
          <HeaderNavigation label="Berlangganan" />
          <ScrollView showsVerticalScrollIndicator={false}>
            <View className="gap-5  px-6 py-4">
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
              <View>
                <Text className="text-xl font-bold text-text-primary">Pilih Siklus Berlangganan</Text>
                <Text className="text-sm leading-6 text-text-warm">Sesuaikan komitmen latihan dengan target kebugaranmu</Text>
              </View>
              <View className="items-center gap-4">
                {weekly?.map((val) => (
                  <PlanCard
                    key={val.id}
                    badge={val.type}
                    status="Aktif"
                    name={val.name}
                    description={val.description}
                    price={`Rp ${val.price.toString()}`}
                    duration={`${val.duration} hari`}
                    buttonLabel="Pilih Paket"
                    onPress={() =>
                      router.push({
                        pathname: "/(gym)/dashboard/[id]",
                        params: { id: val.id }
                      })
                    }
                  />
                ))}
                {monthly?.map((val) => (
                  <PlanCard
                    key={val.id}
                    badge={val.type}
                    status="Aktif"
                    name={val.name}
                    description={val.description}
                    price={`Rp ${val.price.toString()}`}
                    duration={`${val.duration} hari`}
                    buttonLabel="Pilih Paket"
                    onPress={() =>
                      router.push({
                        pathname: "/(gym)/dashboard/[id]",
                        params: { id: val.id }
                      })
                    }
                  />
                ))}
                {yearly?.map((val) => (
                  <PlanCard
                    key={val.id}
                    badge={val.type}
                    status="Aktif"
                    name={val.name}
                    description={val.description}
                    price={`Rp ${val.price.toString()}`}
                    duration={`${val.duration} hari`}
                    buttonLabel="Pilih Paket"
                    onPress={() =>
                      router.push({
                        pathname: "/(gym)/dashboard/[id]",
                        params: { id: val.id }
                      })
                    }
                  />
                ))}
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
