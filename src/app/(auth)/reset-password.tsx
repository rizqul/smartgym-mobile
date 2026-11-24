import { AuthButton } from "@/components/auth/authButton"
import { AuthScreenLayout } from "@/components/auth/authScreenLayout"
import { AuthTextField } from "@/components/auth/authTextField"
import { OrangeGlowBackground } from "@/components/auth/orangeGlowBackground"
import { resetPassword } from "@/service/auth.service"
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
      .min(8, "At least 8 characters")
      .regex(/[A-Z]/, "At least one uppercase letter")
      .regex(/[a-z]/, "At least one lowercase letter")
      .regex(/[0-9]/, "At least one number")
      .regex(/[!@#$%^&*()_+]/, "At least one special character from !@#$%^&*()_+"),
    confirmPassword: z.string()
  })
  .refine((data) => data.confirmPassword === data.password, {
    message: "Passwords do not match"
  })

type FormValues = z.infer<typeof resetPasswordSchema>

const ResetPassword = () => {
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
    { label: "At least 8 characters", ok: newPassword.length >= 8 },
    { label: "At least one uppercase letter", ok: /[A-Z]/.test(newPassword) },
    { label: "At least one lowercase letter", ok: /[a-z]/.test(newPassword) },
    { label: "At least one number", ok: /[0-9]/.test(newPassword) },
    { label: "At least one special character from !@#$%^&*()_+", ok: /[!@#$%^&*()_+]/.test(newPassword) },
    { label: "New password must match the confirmation", ok: newPassword === confirmPassword }
  ]

  const onSubmit = async (data: FormValues) => {
    try {
      await resetPassword(data.password)
      Toast.show({
        type: ALERT_TYPE.SUCCESS,
        title: "Success",
        textBody: "Your password has been changed successfully"
      })
      router.push("/(auth)/login")
    } catch (error: any) {
      if (error.response) {
        const errorMessage = error.response.data?.message || "A server error occurred"
        Toast.show({
          type: ALERT_TYPE.DANGER,
          title: "Verification Failed",
          textBody: errorMessage
        })
      } else {
        Toast.show({
          type: ALERT_TYPE.DANGER,
          title: "Verification Failed",
          textBody: "An unexpected error occurred"
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
              <Text className="font-inter text-3xl font-bold text-text-body">Reset Password</Text>
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
                label="Password"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder="Enter a new password"
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
                label="Confirm Password"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder="Re-enter your password"
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
                <Text className="font-inter text-xs font-semibold text-[#A98A7D]">{label}</Text>
              </View>
            ))}
          </View>
        </View>
        <View>
          <AuthButton
            onPress={handleSubmit(onSubmit)}
            label="Save New Password"
          />
        </View>
      </View>
    </AuthScreenLayout>
  )
}

export default ResetPassword
