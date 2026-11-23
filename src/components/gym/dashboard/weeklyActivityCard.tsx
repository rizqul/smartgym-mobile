import { MaterialCommunityIcons } from "@expo/vector-icons"
import { Text, View } from "react-native"

const WEEKLY_DATA = [
    { day: "Mon", height: 44, active: true },
    { day: "Tue", height: 54, active: true },
    { day: "Wed", height: 24, active: false },
    { day: "Thu", height: 48, active: true },
    { day: "Fri", height: 48, active: true },
    { day: "Sat", height: 36, active: true },
    { day: "Sun", height: 20, active: false }
]
const COLOR_HIGHLIGHT = "#FFD166"

export const WeeklyActivityCard = () => {
    const activeDays = WEEKLY_DATA.filter((d) => d.active).length

    return (
        <View className="rounded-[20px] border border-border bg-surface p-4">
            <View className="mb-4 flex-row items-center justify-between">
                <View className="flex-row items-center gap-2.5">
                    <MaterialCommunityIcons
                        name="calendar-check-outline"
                        size={22}
                        color={COLOR_HIGHLIGHT}
                    />
                    <Text className="text-base font-bold text-text-primary">Weekly Activity</Text>
                </View>

                <View className="rounded-full border border-success/30 bg-success/15 px-3 py-1">
                    <Text className="text-xs font-bold text-success">{activeDays} / 7 Days</Text>
                </View>
            </View>

            {/* Bar Chart */}
            <View className="h-[80px] flex-row items-end justify-between border-b border-border pb-0">
                {WEEKLY_DATA.map((item) => (
                    <View
                        key={item.day}
                        className={`w-[38px] rounded-t-lg ${item.active ? "bg-primary" : "bg-border"}`}
                        style={{ height: item.height }}
                    />
                ))}
            </View>

            <View className="mt-2 flex-row justify-between">
                {WEEKLY_DATA.map((item) => (
                    <Text
                        key={item.day}
                        className="w-[38px] text-center text-[11px] font-semibold text-text-muted"
                    >
                        {item.day}
                    </Text>
                ))}
            </View>
        </View>
    )
}
