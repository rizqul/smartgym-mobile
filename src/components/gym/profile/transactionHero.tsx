import { HeroConfig } from "@/data/helperTransaction/transactionHero"
import { Ionicons } from "@expo/vector-icons"
import React from "react"
import { Text, View } from "react-native"

export function TransactionHero({ hero }: { hero: HeroConfig }) {
  return (
    <View className="w-full items-center justify-center">
      <View className={`mb-2 h-32 w-32 items-center justify-center rounded-full ${hero.outer}`}>
        <View className={`h-24 w-24 items-center justify-center rounded-full ${hero.mid}`}>
          <View className={`h-16 w-16 items-center justify-center rounded-full border-[3px] border-surface ${hero.inner}`}>
            <Ionicons
              name={hero.icon}
              size={32}
              color="#1A1D24"
            />
          </View>
        </View>
      </View>

      <Text className="text-center font-inter text-3xl font-extrabold text-white">{hero.title}</Text>
    </View>
  )
}
