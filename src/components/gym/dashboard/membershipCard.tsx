import { useAuth } from "@/context/authContext"
import { Ionicons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"
import { Text, View } from "react-native"

export const MembershipCard = () => {
    const { user } = useAuth()
    const expiredDate = new Date(user?.membershipExpiredAt!)
    const joinDate = new Date(user?.createdAt!)

    const joinMemberText = joinDate.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric"
    })
    const expiredText = expiredDate.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric"
    })

    const spanStatus = () => {
        const isActive =
            user?.membershipExpiredAt != null &&
            new Date(user.membershipExpiredAt) > new Date();

        return (
            <View
                className={`flex-row items-center gap-1.5 rounded-xl border px-3 py-1 ${isActive
                    ? 'border-success/30 bg-success/15'
                    : 'border-text-secondary/30 bg-text-secondary/15'
                    }`}
            >
                <View
                    className={`h-1.5 w-1.5 rounded-full ${isActive ? 'bg-success' : 'bg-text-secondary'
                        }`}
                />
                <Text
                    className={`text-[11px] font-bold ${isActive ? 'text-success' : 'text-text-secondary'
                        }`}
                >
                    {isActive ? 'ACTIVE' : 'INACTIVE'}
                </Text>
            </View>
        );
    }

    return (
        <LinearGradient
            colors={["#2E1A14", "#1A1D24", "#1A1D24"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="overflow-hidden  border border-border "
            style={{ padding: 20, borderRadius: 20 }}
        >
            {/* Card Header */}
            <View className="mb-5 flex-row items-center justify-between">
                <View className="flex-row items-center gap-3">
                    <View className="h-11 w-11 items-center justify-center rounded-full bg-primary">
                        <Ionicons
                            name="flash"
                            size={20}
                            color="#1A1C20"
                        />
                    </View>
                    <Text className="text-lg font-extrabold tracking-[0.5px] text-text-primary">SMARTGYM ELITE</Text>
                </View>

                {spanStatus()}
            </View>

            {/* Card Body */}
            <View className="flex-row items-center">
                <View className="flex-1">
                    <Text className="mb-1 text-[11px] font-semibold tracking-[0.5px] text-text-muted">Joined since</Text>
                    <Text className="text-lg font-bold tracking-[1px] text-text-primary">{joinMemberText}</Text>
                </View>

                <View className="mx-4 h-10 w-px bg-primary/40" />

                <View className="flex-1 items-end">
                    <Text className="mb-1 text-[11px] font-semibold tracking-[0.5px] text-text-muted">Until</Text>
                    <Text className="text-lg font-bold text-text-primary">{expiredText}</Text>
                </View>
            </View>
        </LinearGradient>
    )
}
