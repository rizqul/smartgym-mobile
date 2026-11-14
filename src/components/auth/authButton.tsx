import AntDesign from "@expo/vector-icons/AntDesign"
import { Pressable, Text } from "react-native"

type AuthButtonProps = {
  label: string
  onPress?: () => void
  disabled?: boolean
}

export function AuthButton({ label, onPress, disabled = false }: AuthButtonProps) {
  return (
    <Pressable
      className={`w-[335] flex-row items-center justify-center gap-3 rounded-xl py-4 shadow-[#561F00] ${disabled ? "bg-[#FFB580]" : "bg-primary"}`}
      onPress={onPress}
      disabled={disabled}
    >
      <Text className="text-base font-bold text-[#561F00]">{label}</Text>
      <AntDesign
        name="arrow-right"
        size={15}
        color="#561F00"
      />
    </Pressable>
  )
}
