import { CheckinResponse } from '@/type/checkin.type'
import { formatDate, FormatTime } from '@/utils/FormaterHelper'
import { Ionicons } from '@expo/vector-icons'
import React from 'react'
import { Text, View } from 'react-native'

export default function CardHistoryCheckin({ item }: Readonly<{ item: CheckinResponse }>) {
    const time = FormatTime(item.checkInAt)
    const isDenied = item.status === "DENIED"
    // dumy
    const centralGym = " SmartGym Central Base"

    const calculateDuration = (inAt: string, outAt: string | null) => {
        if (!outAt) return "Sedang Latihan"

        const start = new Date(inAt).getTime()
        const end = new Date(outAt).getTime()
        const diffMs = end - start

        const diffMins = Math.floor(diffMs / 60000)
        const hours = Math.floor(diffMins / 60)
        const mins = diffMins % 60

        if (hours > 0) return `${hours}j ${mins}m`
        return `${mins}m`
    }

    // Helper untuk menampilkan rentang waktu (Masuk - Keluar)
    const formatTimeRange = (inAt: string, outAt: string | null) => {
        const start = FormatTime(inAt)
        const startStr = `${start.hour}:${start.minute}`

        if (!outAt) return `${startStr} - (Aktif)`

        const end = FormatTime(outAt)
        return `${startStr} - ${end.hour}:${end.minute}`
    }

    return (
        <View className="flex-row items-center mb-3 gap-4 rounded-xl border border-border/50 bg-surface p-4">
            {/* Icon / Tanggal */}
            <View className="h-12 w-12 items-center justify-center rounded-xl border border-border bg-background">
                <Text className={`text-xs font-bold ${isDenied ? 'text-danger' : 'text-primary'}`}>{time.hour}</Text>
                <Text className="text-[10px] text-text-secondary">{time.minute}</Text>
            </View>

            {/* Detail */}
            <View className="flex-1">
                <Text className="mb-0.5 text-sm font-bold text-text-primary">
                    {centralGym}
                </Text>

                {/* Tanggal & Jam Masuk-Keluar */}
                <View className="flex-row items-center flex-wrap gap-2 mb-1.5">
                    <Text className="text-xs text-text-secondary">
                        {formatDate(item.checkInAt)}
                    </Text>

                    {/* Badge Jam Masuk & Keluar */}
                    <View className="flex-row items-center gap-1 rounded-md border border-border/50 bg-background px-1.5 py-0.5">
                        <Ionicons name="time-outline" size={10} color="#B8BDC7" />
                        <Text className="text-[10px] font-medium text-text-primary">
                            {formatTimeRange(item.checkInAt, item.checkOutAt)}
                        </Text>
                    </View>
                </View>

                <View className="flex-row items-center gap-2">
                    {/* Status Badge */}
                    <View className={`flex-row items-center gap-1 rounded px-2 py-0.5 ${isDenied ? 'bg-danger/15' : 'bg-success/15'}`}>
                        <View className={`h-1.5 w-1.5 rounded-full ${isDenied ? 'bg-danger' : 'bg-success'}`} />
                        <Text className={`text-[10px] font-bold ${isDenied ? 'text-danger' : 'text-success'}`}>
                            {isDenied ? "Ditolak" : "Berhasil"}
                        </Text>
                    </View>

                    {/* Duration / Reason */}
                    {isDenied ? (
                        <Text className="text-[10px] text-danger" numberOfLines={1}>
                            • {item.denialReason || "Akses Ditolak"}
                        </Text>
                    ) : (
                        <Text className="text-[10px] text-text-secondary">
                            • Durasi: {calculateDuration(item.checkInAt, item.checkOutAt)}
                        </Text>
                    )}
                </View>
            </View>

            {/* Chevron */}
            <Ionicons name="chevron-forward" size={16} color="#B8BDC7" />
        </View>
    )
}