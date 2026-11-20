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
import { Pressable, Text, View } from "react-native"
import { ALERT_TYPE, Toast } from "react-native-alert-notification"
import { SafeAreaView } from "react-native-safe-area-context"
import { z } from "zod"

const changePasswordSchema = z
  .object({
    oldPassword: z.string().min(1, "Kata sandi lama wajib diisi"),
    newPassword: z
      .string()
      .min(8, "Panjang minimal 8 karakter")
      .regex(/[A-Z]/, "Minimal ada 1 huruf kapital")
      .regex(/[a-z]/, "Minimal ada 1 huruf kecil")
      .regex(/[0-9]/, "Minimal ada 1 angka")
      .regex(/[!@#$%^&*()_+]/, "Minimal memiliki 1 karakter dari !@#$%^&*()_+"),
    confirmPassword: z.string().min(1, "Konfirmasi Kata Sandi wajib diisi")
  })
  .refine((data) => data.newPassword !== data.oldPassword, {
    message: "Kata sandi baru tidak boleh sama dengan Kata sandi lama",
    path: ["newPassword"]
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Kata sandi dan konfirmasi kata sandi tidak sama",
    path: ["confirmPassword"]
  })

type FormValues = z.infer<typeof changePasswordSchema>

type FieldName = keyof FormValues

const fields: { name: FieldName; label: string; placeholder: string }[] = [
  { name: "oldPassword", label: "Kata Sandi Lama", placeholder: "Masukkan Kata Sandi lama" },
  { name: "newPassword", label: "Kata Sandi Baru", placeholder: "Masukkan Kata Sandi baru" },
  { name: "confirmPassword", label: "Konfirmasi Kata Sandi Baru", placeholder: "Ulangi Kata Sandi baru" }
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
    formState: { errors, isSubmitting }
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
        title: "Berhasil",
        textBody: `Kata Sandi berhasil diperbaharui.`
      })
      router.back()
    } catch (error: any) {
      const message = error.response?.data?.message || "Gagal mengirim kode. Coba lagi."
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: "Gagal",
        textBody: message,
        autoClose: 3000
      })
    }
  }

  const oldPassword = watch("oldPassword")
  const newPassword = watch("newPassword")
  const confirmPassword = watch("confirmPassword")

  const rules = [
    { label: "Panjang minimal 8 karakter", ok: newPassword.length >= 8 },
    { label: "Minimal ada 1 huruf kapital", ok: /[A-Z]/.test(newPassword) },
    { label: "Minimal ada 1 huruf kecil", ok: /[a-z]/.test(newPassword) },
    { label: "Minimal ada 1 angka", ok: /[0-9]/.test(newPassword) },
    { label: "Minimal ada 1 karakter dari !@#$%^&*()_+", ok: /[!@#$%^&*()_+]/.test(newPassword) },
    { label: "Kata sandi baru tidak boleh sama dengan kata sandi lama", ok: oldPassword !== newPassword },
    { label: "Kata sandi baru harus sama dengan konfirmasi kata sandi", ok: newPassword === confirmPassword }
  ]

  return (
    <>
      <SafeAreaView className="flex-1 bg-background">
        <View className="flex-1 bg-background">
          <HeaderNavigation label="Ubah Kata Sandi" />
          <View className="flex items-center justify-start gap-8">
            {/* Header */}
            <View className="mt-5 w-[345] flex-row items-center gap-6">
              <View className="flex h-[76] w-[76] items-center justify-center rounded-2xl bg-white/10 shadow-xl">
                <View className="flex h-[56] w-[56] items-center justify-center rounded-full border border-dashed border-[#FF6B00]">
                  <MaterialIcons
                    name="lock"
                    size={25}
                    color="#FF6B00"
                  />
                </View>
              </View>
              <View className="flex w-[340]  gap-1">
                <Text className="text-3xl font-bold text-text-body">Lindungi akunmu</Text>
                <Text className="w-[240] text-sm leading-6 text-[#E2BFB0]">
                  Masukkan kata sandi lama kamu, lalu buat kata sandi baru yang lebih aman.
                </Text>
              </View>
            </View>

            {/* Input Part */}
            <View className="flex">
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
                          errors[name]?.message === "Kata sandi lama wajib diisi" ||
                          errors[name]?.message === "Konfirmasi Kata Sandi wajib diisi"
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

            {/* Submit */}
            <View>
              <AuthButton
                onPress={handleSubmit(onSubmit)}
                label="Simpan Password Baru"
              />
            </View>
          </View>
        </View>
      </SafeAreaView>
    </>
  )
}
