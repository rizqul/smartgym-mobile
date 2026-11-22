import { Text, TouchableOpacity } from "react-native";

export const ActionButton = ({ label, icon, onPress }: { label: string; icon: React.ReactNode; onPress: () => void }) => (
    <TouchableOpacity
        activeOpacity={0.8}
        onPress={onPress}
        className="flex-1 items-center justify-center gap-2 rounded-2xl border border-border bg-surface py-4"
    >
        {icon}
        <Text className="text-xs font-semibold text-text-primary">{label}</Text>
    </TouchableOpacity>
)