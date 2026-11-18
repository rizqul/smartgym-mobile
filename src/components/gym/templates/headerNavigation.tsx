import { Ionicons } from "@expo/vector-icons"
import { router } from "expo-router"
import React from "react"
import { Text, TouchableOpacity, View } from "react-native"

const headerNavigation = ({ label }: { label: string }) => {
  return (
    <View className="w-full flex-row items-center gap-4 border-b border-border/40 px-3 py-3">
      <TouchableOpacity
        onPress={() => router.back()}
        className="h-10 w-10 items-center justify-center rounded-xl border border-border/50 bg-surface"
      >
        <Ionicons
          name="chevron-back"
          size={20}
          color="white"
        />
      </TouchableOpacity>
      <Text className="text-xl font-bold text-text-primary">{label}</Text>
    </View>
  )
}

export default headerNavigation
