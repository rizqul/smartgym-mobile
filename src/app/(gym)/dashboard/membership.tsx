import PlanCard from "@/components/membership/membershipPlanCard"

import React from "react"

const membership = () => {
  return (
    <>
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
