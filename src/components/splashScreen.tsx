import React, { useEffect, useRef } from "react"
import { Animated, Image, Text, View } from "react-native"

export default function SplashLoadingScreen() {
    // Efek animasi pulsing (membesar-mengecil) untuk logo
    const pulseAnim = useRef(new Animated.Value(1)).current

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 1.1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
                Animated.timing(pulseAnim, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
            ])
        ).start()
    }, [pulseAnim])

    return (
        <View className="flex-1 items-center justify-center bg-background">
            {/* Efek Glow di belakang logo */}
            <View className="absolute h-64 w-64 rounded-full bg-primary/20 blur-3xl" />

            {/* Logo Animasi */}
            <Animated.View
                style={{ transform: [{ scale: pulseAnim }] }}
                className="mb-6 items-center justify-center rounded-3xl border border-primary/30 bg-[#231105] p-1 shadow-lg shadow-primary/50"
            >
                <Image
                    source={require("@/assets/images/logo.png")}
                    className="h-24 w-24 rounded-2xl"
                    resizeMode="contain"
                />
            </Animated.View>

            {/* Text Branding */}
            <Text className="font-inter text-3xl font-extrabold tracking-widest text-text-primary">
                SMART<Text className="text-primary">GYM</Text>
            </Text>

            <Text className="mt-2 font-inter text-xs tracking-widest text-text-secondary">
                SMART FITNESS & IOT CONNECTED GYM
            </Text>


            <View className="mt-12 h-1 w-32 overflow-hidden rounded-full bg-surface">
                <Animated.View
                    className="h-full bg-primary"
                    style={{
                        width: "50%",
                        transform: [{
                            translateX: pulseAnim.interpolate({
                                inputRange: [1, 1.1],
                                outputRange: [-20, 20]
                            })
                        }]
                    }}
                />
            </View>
        </View>
    )
}