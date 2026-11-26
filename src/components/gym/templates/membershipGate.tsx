import { useAuth } from "@/context/authContext"
import { isMembershipActive } from "@/utils/membershipHelper"
import { Ionicons } from "@expo/vector-icons"
import { BlurView } from "expo-blur"
import { useRouter } from "expo-router"
import React from "react"
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native"

type Props = {
  children: React.ReactNode
  title?: string
  description?: string
}

export default function MembershipGate({
  children,
  title = "Members-Only Feature",
  description = "Activate your membership to unlock this feature."
}: Readonly<Props>) {
  const router = useRouter()

  const { user } = useAuth()

  if (user === undefined) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator
          size="large"
          color="#FF6B00"
        />
      </View>
    )
  }

  const locked = !isMembershipActive(user?.membershipExpiredAt)
  if (!locked) return <>{children}</>

  const expired = !!user?.membershipExpiredAt

  return (
    <View className="flex-1 bg-background">
      {/* Background content: disabled and hidden from screen readers */}
      <View
        className="flex-1"
        pointerEvents="none"
        importantForAccessibility="no-hide-descendants"
        accessibilityElementsHidden
      >
        {children}
      </View>

      {/* Blur overlay */}
      <BlurView
        intensity={40}
        tint="dark"
        experimentalBlurMethod="dimezisBlurView"
        className="absolute inset-0 items-center justify-center px-6"
      >
        {/* Dark layer: keeps content covered on devices with weaker blur */}
        <View className="absolute inset-0 bg-background/70" />

        <View className="w-full items-center gap-4 rounded-3xl border border-primary/30 bg-surface p-6">
          <View className="h-16 w-16 items-center justify-center rounded-full border border-primary/40 bg-primary/10">
            <Ionicons
              name="lock-closed"
              size={28}
              color="#FF6B00"
            />
          </View>

          <View className="items-center gap-1.5">
            <Text className="text-center font-inter text-xl font-bold text-text-primary">{expired ? "Membership Expired" : title}</Text>
            <Text className="text-center font-inter text-sm leading-5 text-text-secondary">
              {expired ? "Renew your membership to access this feature again." : description}
            </Text>
          </View>

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => router.push("/(gym)/dashboard/membership")}
            className="w-full flex-row items-center justify-center gap-2 rounded-xl bg-primary py-3.5"
          >
            <Text className="font-inter text-sm font-bold text-background">{expired ? "Renew Membership" : "Buy Membership"}</Text>
            <Ionicons
              name="arrow-forward"
              size={16}
              color="#111317"
            />
          </TouchableOpacity>
        </View>
      </BlurView>
    </View>
  )
}
