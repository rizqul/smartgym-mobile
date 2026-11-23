import { AuthButton } from "@/components/auth/authButton"
import { AuthScreenLayout } from "@/components/auth/authScreenLayout"
import { AuthTextField } from "@/components/auth/authTextField"
import { OrangeGlowBackground } from "@/components/auth/orangeGlowBackground"
import { ResetPassword } from "@/service/auth.service"
import { AntDesign, Entypo } from "@expo/vector-icons"
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons"
import { zodResolver } from "@hookform/resolvers/zod"
import { router } from "expo-router"
import React, { useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { Pressable, Text, View } from "react-native"
import { ALERT_TYPE, Toast } from "react-native-alert-notification"
import { z } from "zod"

const resetPasswordSchema = z
  .object({
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

type FormValues = z.infer<typeof resetPasswordSchema>

const resetPassword = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<FormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" }
  })

  const newPassword = watch("password")
  const confirmPassword = watch("confirmPassword")

  const rules = [
    { label: "Panjang minimal 8 karakter", ok: newPassword.length >= 8 },
    { label: "Minimal ada 1 huruf kapital", ok: /[A-Z]/.test(newPassword) },
    { label: "Minimal ada 1 huruf kecil", ok: /[a-z]/.test(newPassword) },
    { label: "Minimal ada 1 angka", ok: /[0-9]/.test(newPassword) },
    { label: "Minimal ada 1 karakter dari !@#$%^&*()_+", ok: /[!@#$%^&*()_+]/.test(newPassword) },
    { label: "Kata sandi baru harus sama dengan konfirmasi kata sandi", ok: newPassword === confirmPassword }
  ]

  const onSubmit = async (data: FormValues) => {
    try {
      await ResetPassword(data.password)
      Toast.show({
        type: ALERT_TYPE.SUCCESS,
        title: "Berhasil",
        textBody: `Kata sandi berhasil diubah`
      })
      router.push("/(auth)/login")
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
      <OrangeGlowBackground style={{ position: "absolute", top: -320, left: 0, right: 0, bottom: 0 }} />

      <View className="mx-auto flex w-full max-w-[385px] gap-8 px-5">
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
              <Text className="text-3xl font-bold text-text-body">Reset Password</Text>
            </View>
          </View>
        </View>

        {/* Input Part */}
        <View className="flex gap-5">
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

          <Controller
            control={control}
            name="confirmPassword"
            render={({ field: { value, onChange, onBlur } }) => (
              <AuthTextField
                label="Konfirmasi Kata Sandi"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder="Ulangi Kata Sandi"
                secureTextEntry={!showConfirmPassword}
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
          <View className="flex  w-[340] gap-2 rounded-xl bg-surface px-4 py-4 ">
            {rules.map(({ label, ok }) => (
              <View
                key={label}
                className="flex-row items-center gap-2"
              >
                <AntDesign
                  name={ok ? "check-circle" : "close-circle"}
                  size={18}
                  color={ok ? "#FF6B00" : "#EF4444"}
                />
                <Text className="text-xs font-semibold text-[#A98A7D]">{label}</Text>
              </View>
            ))}
          </View>
        </View>
        <View>
          <AuthButton
            onPress={handleSubmit(onSubmit)}
            label="Simpan Kata Sandi Baru"
          />
        </View>
      </View>
    </AuthScreenLayout>
  )
}

export default resetPassword
