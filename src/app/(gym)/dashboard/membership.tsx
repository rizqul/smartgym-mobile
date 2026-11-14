import MembershipActiveCard from "@/components/membership/membershipActiveCard"
import MembershipHeader from "@/components/membership/membershipHeader"
import PlanCard from "@/components/membership/membershipPlanCard"

import React from "react"

const membership = () => {
  return (
    <>
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
    </>
  )
}

export default membership
