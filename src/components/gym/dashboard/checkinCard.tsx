import { CheckinResponse } from '@/type/checkin.type'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'

export default function CheckinCard({ activeCheckin, handleCheckout }: Readonly<{
    activeCheckin: CheckinResponse
    handleCheckout: () => void
}>) {
    return (
        <View className="bg-[#1A2E22] border border-success/30 rounded-[20px] p-4 flex-row items-center justify-between">
            <View className="flex-row items-center gap-3">
                <View className="h-10 w-10 bg-success/20 rounded-full items-center justify-center">
                    <MaterialCommunityIcons name="door-open" size={20} color="#22C55E" />
                </View>
                <View>
                    <Text className="text-text-primary text-sm font-bold mb-0.5">Currently Practicing!</Text>
                    <Text className="text-[#74C69D] text-xs">
                        Check-in From {new Date(activeCheckin.checkInAt).toLocaleTimeString("id-ID", { hour: '2-digit', minute: '2-digit' })} WIB
                    </Text>
                </View>
            </View>
            <TouchableOpacity
                onPress={handleCheckout}
                className="px-4 py-2 rounded-xl border border-danger/30 bg-danger/20"
            >
                <Text className="text-danger text-xs font-bold">Checkout</Text>
            </TouchableOpacity>
        </View>
    )
}