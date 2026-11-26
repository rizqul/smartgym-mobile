
import { SummaryCheckin } from "@/type/checkin.type"
import { Ionicons } from "@expo/vector-icons"
import { Text, View } from "react-native"

const COLOR_PRIMARY = "#FF7A00"
const COLOR_INFO = "#60A5FA"

interface FitnessProgressCardProps {
    summary?: SummaryCheckin | null
    targetHours?: number
}

export const FitnessProgressCard = ({
    summary,
    targetHours = 50
}: FitnessProgressCardProps) => {
    const totalHours = summary?.totalGymHours ?? 0
    const currentStreak = summary?.currentStreak ?? 0
    const longestStreak = summary?.longestStreak ?? 0
    const progress =
        targetHours > 0
            ? Math.min(Math.round((totalHours / targetHours) * 100), 100)
            : 0

    return (
        <View className="rounded-[20px] border border-border bg-surface p-4">
            <View className="mb-3 flex-row items-center gap-2.5">
                <Ionicons name="stats-chart" size={20} color={COLOR_PRIMARY} />
                <Text className="text-base font-bold text-text-primary">Fitness Progress</Text>
            </View>

            <View className="flex-row gap-3">
                {/* Gym Time */}
                <View className="flex-1 rounded-2xl border border-border bg-background p-3">
                    <View className="flex-row items-center gap-2.5">
                        <Ionicons name="stopwatch-outline" size={32} color={COLOR_INFO} />
                        <View>
                            <Text className="text-xs text-text-subdued">Total Gym Time</Text>
                            <Text className="text-2xl font-bold text-text-primary">
                                {totalHours}h
                            </Text>
                            <Text className="text-xs text-text-subdued">Target: {targetHours}h</Text>
                        </View>
                    </View>

                    <View className="mt-3 flex-row items-center gap-2">
                        <View className="h-2 flex-1 overflow-hidden rounded-full bg-border">
                            <View
                                className="h-full rounded-full bg-info"
                                style={{ width: `${progress}%` }}
                            />
                        </View>
                        <Text className="text-[11px] font-semibold text-text-primary">
                            {progress}%
                        </Text>
                    </View>
                </View>

                {/* Streak */}
                <View className="flex-1 rounded-2xl border border-border bg-background p-3">
                    <View className="flex-row items-center gap-2.5">
                        <Ionicons name="flame" size={32} color={COLOR_PRIMARY} />
                        <View>
                            <Text className="text-xs text-text-subdued">Current Streak</Text>
                            <Text className="text-2xl font-bold text-text-primary">
                                {currentStreak} Days
                            </Text>
                        </View>
                    </View>

                    <Text className="mt-2 text-xs font-semibold text-highlight">
                        Best: {longestStreak} Days
                    </Text>
                    <Text className="text-xs text-text-subdued">
                        {currentStreak >= longestStreak && currentStreak > 0
                            ? "New record! 🔥"
                            : "Keep going!"}
                    </Text>
                </View>
            </View>
        </View>
    )
}