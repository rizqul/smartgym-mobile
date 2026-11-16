import { AuthButton } from "@/components/auth/authButton"
import { AuthScreenLayout } from "@/components/auth/authScreenLayout"
import { AuthTextField } from "@/components/auth/authTextField"
import { Entypo, MaterialIcons } from "@expo/vector-icons"
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons"
import { zodResolver } from "@hookform/resolvers/zod"
import React, { useEffect, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { Pressable, Text, View } from "react-native"
import { OtpInput } from "react-native-otp-entry"
import { Defs, RadialGradient, Rect, Stop, Svg } from "react-native-svg"
import { z } from "zod"

const forgotPasswordSchema = z
  .object({
    otp: z
      .string()
      .min(6, "Panjang otp minimal 6 angka")
      .regex(/[^[0-9]$/, "Input harus berupa angka"),
    password: z
      .string()
      .min(8, "Panjang minimal 8 karakter")
      .regex(/[A-Z]/, "Minimal ada 1 huruf kapital")
      .regex(/[a-z]/, "Minimal ada 1 huruf kecil")
      .regex(/[0-9]/, "Minimal ada 1 angka")
      .regex(/[!@#$%^&*()_+]/, "Minimal memiliki 1 karakter dari !@#$%^&*()_+"),
    confirmPassword: z.string()
  })
  .refine((data) => data.confirmPassword === data.password, {
    message: "Kata Sandi Tidak Sama"
  })

type FormValues = z.infer<typeof forgotPasswordSchema>

const formatTime = (totalSeconds: number) => {
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, "0")
  const seconds = String(totalSeconds % 60).padStart(2, "0")
  return `${minutes}:${seconds}`
}

const RESEND_SECONDS = 60

const otpAndResetPassword = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [otp, setOtp] = useState("")
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS)
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<FormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" }
  })

  useEffect(() => {
    if (secondsLeft <= 0) return
    const timeout = setTimeout(() => setSecondsLeft((s) => s - 1), 1000)
    return () => clearTimeout(timeout)
  }, [secondsLeft])

  const canResend = secondsLeft === 0

  const handleResend = () => {
    if (!canResend) return
    setSecondsLeft(RESEND_SECONDS)
  }

  return (
    <AuthScreenLayout>
      <Svg
        width="100%"
        height="100%"
        style={{ position: "absolute", top: -310, left: 0, right: 0, bottom: 0 }}
      >
        <Defs>
          <RadialGradient
            id="orangeGlow"
            cx="50%"
            cy="52%"
            rx="70%"
            ry="30%"
            fx="50%"
            fy="52%"
          >
            <Stop
              offset="0%"
              stopColor="#FF6B00"
              stopOpacity="0.28"
            />
            <Stop
              offset="50%"
              stopColor="#7A3300"
              stopOpacity="0.14"
            />
            <Stop
              offset="100%"
              stopColor="#121215"
              stopOpacity="0"
            />
          </RadialGradient>
        </Defs>
        <Rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          fill="url(#orangeGlow)"
        />
      </Svg>
      <View className="flex items-center justify-start gap-8">
        {/* Header */}
        <View className="flex w-[358] items-center justify-center gap-5">
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
              <Text className="text-3xl font-bold text-text-body">Reset Password</Text>
            </View>
          </View>
        </View>
        {/* Resend Part */}
        <View className="items-center gap-3">
          {/* Timer / kirim ulang kode */}
          {canResend ? (
            <Pressable
              onPress={handleResend}
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
          {/* Kirim ulang via email (nonaktif selama hitung mundur) */}
          <Pressable
            onPress={handleResend}
            disabled={!canResend}
            className="flex-row items-center gap-1.5 p-1"
            accessibilityRole="button"
            accessibilityState={{ disabled: !canResend }}
            accessibilityLabel="Kirim ulang via email"
          >
            <MaterialIcons
              name="sync"
              size={14}
              color={canResend ? "#FFB693" : "#5A5A5F"}
            />
            <Text className={`text-xs ${canResend ? "text-[#FFB693]" : "text-[#5A5A5F]"}`}>Kirim Ulang via Email</Text>
          </Pressable>
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
          <View>
            <Controller
              control={control}
              name="password"
              render={({ field: { value, onChange, onBlur } }) => (
                <AuthTextField
                  label="Kata Sandi"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholder="Masukkan Kata Sandi Baru"
                  error={errors.password?.message}
                  secureTextEntry={!showPassword}
                  accessory={
                    <Pressable
                      className="p-2"
                      onPress={() => setShowPassword((visible) => !visible)}
                      accessibilityLabel={showPassword ? "Hide password" : "Show password"}
                    >
                      <Entypo
                        name={showPassword ? "eye-with-line" : "eye"}
                        size={20}
                        color="#E2BFB0"
                      />
                    </Pressable>
                  }
                />
              )}
            />
          </View>
          <View>
            <Controller
              control={control}
              name="confirmPassword"
              render={({ field: { value, onChange, onBlur } }) => (
                <AuthTextField
                  label="Konfirmasi Kata Sandi"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholder="Masukkan Kata Sandi"
                  error={errors.confirmPassword?.message}
                  secureTextEntry={!showPassword}
                  accessory={
                    <Pressable
                      className="p-2"
                      onPress={() => setShowConfirmPassword((visible) => !visible)}
                      accessibilityLabel={showConfirmPassword ? "Hide password" : "Show password"}
                    >
                      <Entypo
                        name={showConfirmPassword ? "eye-with-line" : "eye"}
                        size={20}
                        color="#E2BFB0"
                      />
                    </Pressable>
                  }
                />
              )}
            />
          </View>
        </View>
        <View>
          <AuthButton label="Verifikasi dan Lanjutkan" />
        </View>
      </View>
    </AuthScreenLayout>
  )
}

export default otpAndResetPassword
