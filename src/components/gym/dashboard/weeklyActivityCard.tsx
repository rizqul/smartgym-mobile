import { SummaryCheckin } from "@/type/checkin.type"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { useMemo } from "react"
import { Text, View } from "react-native"

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const
const COLOR_HIGHLIGHT = "#FFD166"
const ACTIVE_HEIGHTS = [44, 54, 48, 48, 36, 52, 46] // variasi visual
const INACTIVE_HEIGHT = 20

interface WeeklyActivityCardProps {
    summary?: SummaryCheckin | null
}

export const WeeklyActivityCard = ({ summary }: WeeklyActivityCardProps) => {
    // 0 = Senin ... 6 = Minggu
    const todayIdx = (new Date().getDay() + 6) % 7
    const checkedInToday = summary?.checkedInToday ?? false
    const streak = summary?.currentStreak ?? 0

    // Tandai hari-hari aktif: mundur dari hari ini sebanyak `currentStreak`
    // (hanya jika hari ini sudah check-in).
    const activeSet = useMemo(() => {
        const set = new Set<number>()
        if (checkedInToday && streak > 0) {
            const n = Math.min(streak, 7)
            for (let i = 0; i < n; i++) {
                set.add((todayIdx - i + 7) % 7)
            }
        }
        return set
    }, [checkedInToday, streak, todayIdx])

    const data = DAYS.map((day, idx) => {
        const active = activeSet.has(idx)
        return {
            day,
            active,
            isToday: idx === todayIdx,
            height: active ? ACTIVE_HEIGHTS[idx] : INACTIVE_HEIGHT
        }
    })

    const activeDays = activeSet.size
    const totalVisits = summary?.totalVisits ?? 0

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
                    <Text className="text-xs font-bold text-success">
                        {activeDays} / 7 Days
                    </Text>
                </View>
            </View>

            {/* Bar Chart */}
            <View className="h-[80px] flex-row items-end justify-between border-b border-border pb-0">
                {data.map((item) => (
                    <View key={item.day} className="items-center">
                        {item.isToday && (
                            <View className="mb-1 h-1.5 w-1.5 rounded-full bg-primary" />
                        )}
                        <View
                            className={`w-[38px] rounded-t-lg ${item.active ? "bg-primary" : "bg-border"
                                }`}
                            style={{ height: item.height }}
                        />
                    </View>
                ))}
            </View>

            <View className="mt-2 flex-row justify-between">
                {data.map((item) => (
                    <Text
                        key={item.day}
                        className={`w-[38px] text-center text-[11px] font-semibold ${item.isToday ? "text-primary" : "text-text-muted"
                            }`}
                    >
                        {item.day}
                    </Text>
                ))}
            </View>

            {/* Footer info */}
            <View className="mt-3 flex-row items-center justify-between border-t border-border pt-3">
                <View className="flex-row items-center gap-1.5">
                    <MaterialCommunityIcons
                        name="fire"
                        size={14}
                        color={COLOR_HIGHLIGHT}
                    />
                    <Text className="text-[11px] text-text-subdued">
                        Streak: <Text className="font-semibold text-text-primary">{streak} hari</Text>
                    </Text>
                </View>
                <Text className="text-[11px] text-text-subdued">
                    Total visit: <Text className="font-semibold text-text-primary">{totalVisits}x</Text>
                </Text>
            </View>
        </View>
    )
}