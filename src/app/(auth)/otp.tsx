import { AuthButton } from "@/components/auth/authButton"
import { AuthScreenLayout } from "@/components/auth/authScreenLayout"
import { OrangeGlowBackground } from "@/components/auth/orangeGlowBackground"
import { forgotPassword, otpVerification } from "@/service/auth.service"
import { MaterialIcons } from "@expo/vector-icons"
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons"
import { zodResolver } from "@hookform/resolvers/zod"
import { router, useLocalSearchParams } from "expo-router"
import React, { useEffect, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { Pressable, Text, View } from "react-native"
import { ALERT_TYPE, Toast } from "react-native-alert-notification"
import { OtpInput } from "react-native-otp-entry"
import { z } from "zod"

const otpSchema = z.object({
  otp: z.string().min(6, "Panjang otp minimal 6 angka")
})

type FormValues = z.infer<typeof otpSchema>

const formatTime = (totalSeconds: number) => {
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, "0")
  const seconds = String(totalSeconds % 60).padStart(2, "0")
  return `${minutes}:${seconds}`
}

const RESEND_SECONDS = 60

const OtpResetPassword = () => {
  const { email } = useLocalSearchParams<{ email: string }>()
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS)
  const [isResending, setIsResending] = useState(false)

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<FormValues>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: "" }
  })

  useEffect(() => {
    if (secondsLeft <= 0) return
    const timeout = setTimeout(() => setSecondsLeft((s) => s - 1), 1000)
    return () => clearTimeout(timeout)
  }, [secondsLeft])

  const canResend = secondsLeft === 0

  const handleResend = async () => {
    if (!canResend || isResending || !email) return
    setIsResending(true)
    try {
      await forgotPassword(email)
      Toast.show({
        type: ALERT_TYPE.SUCCESS,
        title: "Kode Terkirim Ulang",
        textBody: `Kode OTP baru telah dikirim ke ${email}.`
      })
      setSecondsLeft(RESEND_SECONDS) // Reset timer
    } catch (error: any) {
      const message = error.response?.data?.message || "Gagal mengirim ulang kode. Coba lagi."
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: "Gagal",
        textBody: message,
        autoClose: 3000
      })
    } finally {
      setIsResending(false)
    }
  }

  const onSubmit = async (data: FormValues) => {
    try {
      await otpVerification(data.otp)
      router.push("/(auth)/reset-password")
    } catch (error: any) {
      if (error.response) {
        const errorMessage = error.response.data?.message || "Terjadi kesalahan pada server"
        Toast.show({
          type: ALERT_TYPE.DANGER,
          title: "Verifikasi Gagal",
          textBody: errorMessage
        })
      } else {
        Toast.show({
          type: ALERT_TYPE.DANGER,
          title: "Verifikasi Gagal",
          textBody: error.message
        })
      }
    }
  }

  return (
    <AuthScreenLayout>
      <OrangeGlowBackground style={{ position: "absolute", top: -200, left: 0, right: 0, bottom: 0 }} />

      <View className="mx-auto flex w-full max-w-[385px] justify-start gap-8 px-5">
        {/* Header */}
        <View className="flex items-center justify-center gap-5">
          {/* logo part */}
          <View className="h-[96] w-[96] flex-row items-center justify-center rounded-2xl  bg-white/10 shadow-xl">
            <MaterialCommunityIcons
              name="cellphone-check"
              size={50}
              color="#FF6B00"
            />
          </View>

          {/* Title and Description part */}
          <View className="flex w-[340] items-center justify-center gap-3">
            <View className="flex w-[340] items-center justify-center gap-3">
              <Text className="text-3xl font-bold text-text-body">OTP Verification</Text>
              {email && <Text className="text-sm text-[#E2BFB0]">Dikirim ke: {email}</Text>}
            </View>
          </View>
        </View>
        {/* Resend Part */}
        <View className="items-center gap-3">
          {/* Timer / kirim ulang kode */}
          {canResend ? (
            <Pressable
              onPress={handleResend}
              disabled={isResending}
              className="flex-row items-center gap-2 rounded-full bg-white/10 px-4 py-2"
              accessibilityRole="button"
              accessibilityLabel="Kirim ulang kode"
            >
              <MaterialIcons
                name="refresh"
                size={16}
                color="#FF6B00"
              />
              <Text className="text-xs font-semibold text-[#FFB693]">Kirim ulang kode</Text>
            </Pressable>
          ) : (
            <View className="flex-row items-center gap-2 rounded-full bg-white/10 px-4 py-2">
              <MaterialIcons
                name="schedule"
                size={16}
                color="#FF6B00"
              />
              <Text className="text-xs text-[#E2BFB0]">Kirim ulang kode dalam</Text>
              <Text
                className="text-xs font-bold text-[#FFC24B]"
                style={{ fontVariant: ["tabular-nums"] }}
              >
                {formatTime(secondsLeft)}
              </Text>
            </View>
          )}
        </View>
        {/* Input Part */}
        <View className="flex items-center gap-5">
          <Controller
            control={control}
            name="otp"
            render={({ field: { onChange } }) => (
              <OtpInput
                numberOfDigits={6}
                type="numeric"
                focusColor="#FF6B00"
                onTextChange={onChange}
                theme={{
                  containerStyle: { width: 340 },
                  pinCodeContainerStyle: {
                    width: 48,
                    height: 56,
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: "transparent",
                    backgroundColor: "rgba(255,255,255,0.08)"
                  },
                  pinCodeTextStyle: {
                    fontSize: 24,
                    fontWeight: "700",
                    color: "#FFFFFF"
                  },
                  focusedPinCodeContainerStyle: {
                    borderColor: "#FF6B00",
                    backgroundColor: "rgba(255,107,0,0.12)"
                  },
                  filledPinCodeContainerStyle: {
                    backgroundColor: "rgba(255,255,255,0.12)"
                  },
                  focusStickStyle: {
                    backgroundColor: "#FF6B00",
                    width: 3,
                    height: 22,
                    borderRadius: 2
                  }
                }}
              />
            )}
          />
          <Text className="font-inter text-sm text-danger">{errors.otp?.message}</Text>
        </View>
        <View>
          <AuthButton
            onPress={handleSubmit(onSubmit)}
            label="Verifikasi dan Lanjutkan"
          />
        </View>
      </View>
    </AuthScreenLayout>
  )
}

export default OtpResetPassword
