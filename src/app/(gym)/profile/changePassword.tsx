import { AuthButton } from "@/components/auth/authButton"
import { AuthTextField } from "@/components/auth/authTextField"
import HeaderNavigation from "@/components/gym/templates/headerNavigation"
import { changePassword } from "@/service/user.service"
import { Entypo, MaterialIcons } from "@expo/vector-icons"
import AntDesign from "@expo/vector-icons/AntDesign"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "expo-router"
import React, { useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { Pressable, ScrollView, StatusBar, Text, View } from "react-native"
import { ALERT_TYPE, Toast } from "react-native-alert-notification"
import { SafeAreaView } from "react-native-safe-area-context"
import { z } from "zod"

const changePasswordSchema = z
  .object({
    oldPassword: z.string().min(1, "Old password is required"),
    newPassword: z
      .string()
      .min(8, "Minimum length is 8 characters")
      .regex(/[A-Z]/, "Minimum 1 uppercase letter")
      .regex(/[a-z]/, "Minimum 1 lowercase letter")
      .regex(/[0-9]/, "Minimum 1 number")
      .regex(/[!@#$%^&*()_+]/, "Minimum 1 character from !@#$%^&*()_+"),
    confirmPassword: z.string().min(1, "Password confirmation is required")
  })
  .refine((data) => data.newPassword !== data.oldPassword, {
    message: "New password must not be the same as the old password",
    path: ["newPassword"]
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Password and confirmation password do not match",
    path: ["confirmPassword"]
  })

type FormValues = z.infer<typeof changePasswordSchema>

type FieldName = keyof FormValues

const fields: { name: FieldName; label: string; placeholder: string }[] = [
  { name: "oldPassword", label: "Old Password", placeholder: "Enter your old password" },
  { name: "newPassword", label: "New Password", placeholder: "Enter your new password" },
  { name: "confirmPassword", label: "Confirm New Password", placeholder: "Repeat your new password" }
]

export default function ChangePassword() {
  const router = useRouter()
  const [visible, setVisible] = useState<Record<FieldName, boolean>>({
    oldPassword: false,
    newPassword: false,
    confirmPassword: false
  })

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<FormValues>({
    resolver: zodResolver(changePasswordSchema),
    mode: "onChange",
    defaultValues: { oldPassword: "", newPassword: "", confirmPassword: "" }
  })

  const toggleVisible = (name: FieldName) => setVisible((prev) => ({ ...prev, [name]: !prev[name] }))

  const onSubmit = async (data: FormValues) => {
    try {
      await changePassword(data.oldPassword, data.newPassword)
      Toast.show({
        type: ALERT_TYPE.SUCCESS,
        title: "Success",
        textBody: "Password updated successfully."
      })
      router.back()
    } catch (error: any) {
      const message = error.response?.data?.message || "Failed to update password. Please try again."
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: "Failed",
        textBody: message,
        autoClose: 3000
      })
    }
  }

  const oldPassword = watch("oldPassword")
  const newPassword = watch("newPassword")
  const confirmPassword = watch("confirmPassword")

  const rules = [
    { label: "Minimum length is 8 characters", ok: newPassword.length >= 8 },
    { label: "Minimum 1 uppercase letter", ok: /[A-Z]/.test(newPassword) },
    { label: "Minimum 1 lowercase letter", ok: /[a-z]/.test(newPassword) },
    { label: "Minimum 1 number", ok: /[0-9]/.test(newPassword) },
    { label: "Minimum 1 character from !@#$%^&*()_+", ok: /[!@#$%^&*()_+]/.test(newPassword) },
    { label: "New password must not be the same as the old password", ok: oldPassword !== newPassword },
    { label: "New password must match the confirmation password", ok: newPassword === confirmPassword }
  ]

  return (
    <SafeAreaView className="flex-1 bg-background">
      <StatusBar barStyle="light-content" />
      <HeaderNavigation label="Change Password" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="px-5 mt-5 pb-10 gap-6"
      >
        {/* Header */}
        <View className=" flex-row items-center gap-6">
          <View className="flex h-[76] w-[76] items-center justify-center rounded-2xl bg-white/10 shadow-xl">
            <View className="flex h-[56] w-[56] items-center justify-center rounded-full border border-dashed border-[#FF6B00]">
              <MaterialIcons
                name="lock"
                size={25}
                color="#FF6B00"
              />
            </View>
          </View>
          <View className=" flex w-[340]  gap-1">
            <Text className="font-inter text-3xl font-bold text-text-body">Protect your account</Text>
            <Text className="w-[240] font-inter text-sm leading-6 text-[#E2BFB0]">
              Enter your old password, then create a stronger new password.
            </Text>
          </View>
        </View>

        {/* Input Part */}
        <View className="flex gap-4">
          {fields.map(({ name, label, placeholder }) => (
            <View key={name}>
              <Controller
                control={control}
                name={name}
                render={({ field: { value, onChange, onBlur } }) => (
                  <AuthTextField
                    label={label}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={
                      errors[name]?.message === "Old password is required" || errors[name]?.message === "Password confirmation is required"
                        ? errors[name]?.message
                        : ""
                    }
                    placeholder={placeholder}
                    secureTextEntry={!visible[name]}
                    autoCapitalize="none"
                    accessory={
                      <Pressable
                        className="p-2"
                        onPress={() => toggleVisible(name)}
                        accessibilityLabel={visible[name] ? "Hide password" : "Show password"}
                      >
                        <Entypo
                          name={visible[name] ? "eye-with-line" : "eye"}
                          size={20}
                          color="#E2BFB0"
                        />
                      </Pressable>
                    }
                  />
                )}
              />
            </View>
          ))}
        </View>

        {/* Label */}

        <View className="flex gap-2 rounded-xl bg-surface px-4 py-4 ">
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

        {/* Submit */}
        <View>
          <AuthButton
            onPress={handleSubmit(onSubmit)}
            label="Save New Password"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
