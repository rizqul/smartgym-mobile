import { Ionicons } from "@expo/vector-icons"
import React from "react"
import { Modal, Pressable, Text, TouchableOpacity, View } from "react-native"

export type AppModalVariant = "success" | "warning" | "danger" | "info"

type VariantStyle = {
  icon: React.ComponentProps<typeof Ionicons>["name"]
  iconColor: string
  ring: string
  circle: string
}

const VARIANTS: Record<AppModalVariant, VariantStyle> = {
  success: { icon: "checkmark", iconColor: "#1A1D24", ring: "bg-success/20", circle: "bg-success" },
  warning: { icon: "time", iconColor: "#1A1D24", ring: "bg-secondary/20", circle: "bg-secondary" },
  danger: { icon: "close", iconColor: "#1A1D24", ring: "bg-danger/20", circle: "bg-danger" },
  info: { icon: "information", iconColor: "#1A1D24", ring: "bg-info/20", circle: "bg-info" }
}

export type AppModalProps = {
  visible: boolean
  onClose: () => void
  title: string
  message?: string
  variant?: AppModalVariant
  primaryLabel?: string
  onPrimary?: () => void
  secondaryLabel?: string
  onSecondary?: () => void
  primaryTone?: "primary" | "danger"
  dismissOnBackdrop?: boolean
}

export default function AppModal({
  visible,
  onClose,
  title,
  message,
  variant,
  primaryLabel = "OK",
  onPrimary,
  secondaryLabel,
  onSecondary,
  primaryTone = "primary",
  dismissOnBackdrop = true
}: AppModalProps) {
  const style = variant ? VARIANTS[variant] : null

  const handlePrimary = () => (onPrimary ? onPrimary() : onClose())
  const handleSecondary = () => (onSecondary ? onSecondary() : onClose())

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={dismissOnBackdrop ? onClose : undefined}
    >
      <Pressable
        className="flex-1 items-center justify-center bg-black/70 px-6"
        onPress={dismissOnBackdrop ? onClose : undefined}
      >
        {/* Pressable kosong supaya sentuhan di dalam kartu tidak menutup modal */}
        <Pressable className="w-full max-w-[340px] items-center gap-5 rounded-2xl border border-border bg-card p-6">
          {style ? (
            <View className={`h-20 w-20 items-center justify-center rounded-full ${style.ring}`}>
              <View className={`h-14 w-14 items-center justify-center rounded-full ${style.circle}`}>
                <Ionicons
                  name={style.icon}
                  size={28}
                  color={style.iconColor}
                />
              </View>
            </View>
          ) : null}

          <View className="items-center gap-2">
            <Text className="text-center font-inter text-xl font-bold text-text-primary">{title}</Text>
            {message ? <Text className="text-center font-inter text-sm leading-5 text-text-secondary">{message}</Text> : null}
          </View>

          <View className="w-full flex-row gap-3">
            {secondaryLabel ? (
              <TouchableOpacity
                activeOpacity={0.8}
                className="flex-1 items-center rounded-xl border border-border bg-surface py-3.5"
                onPress={handleSecondary}
              >
                <Text className="font-inter text-sm font-semibold text-text-secondary">{secondaryLabel}</Text>
              </TouchableOpacity>
            ) : null}

            <TouchableOpacity
              activeOpacity={0.8}
              className={`flex-1 items-center rounded-xl py-3.5 ${primaryTone === "danger" ? "bg-danger" : "bg-primary"}`}
              onPress={handlePrimary}
            >
              <Text className="font-inter text-sm font-bold text-white">{primaryLabel}</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  )
}
