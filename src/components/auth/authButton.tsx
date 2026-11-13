import AntDesign from '@expo/vector-icons/AntDesign';
import { ReactNode } from "react";
import { Pressable, Text } from "react-native";

type AuthButtonProps = {
  children: ReactNode;
  onPress: () => void;
  disabled?: boolean;
};

export function AuthButton({ children, onPress, disabled = false }: AuthButtonProps) {
  return (
    <Pressable className={`items-center rounded-xl shadow-[#561F00] py-4 ${disabled ? "bg-[#FFB580]" : "bg-[#FF6B00]"}`} onPress={onPress} disabled={disabled}>
      <Text className="text-base font-bold text-[#561F00]">{children}</Text>
      <AntDesign name="arrow-right" size={20} color="#561F00" />
    </Pressable>
  );
}
