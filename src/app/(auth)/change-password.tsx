import { AuthButton } from "@/components/auth/authButton"
import { AuthTextField } from "@/components/auth/authTextField"
import { Entypo, Ionicons, MaterialIcons } from "@expo/vector-icons"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "expo-router"
import React, { useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { Pressable, Text, TouchableOpacity, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { z } from "zod"

const changePasswordSchema = z
  .object({
    oldPassword: z.string().min(1, "Password lama wajib diisi"),
    newPassword: z
      .string()
      .min(8, "Panjang minimal 8 karakter")
      .regex(/[A-Z]/, "Minimal ada 1 huruf kapital")
      .regex(/[a-z]/, "Minimal ada 1 huruf kecil")
      .regex(/[0-9]/, "Minimal ada 1 angka")
      .regex(/[!@#$%^&*()_+]/, "Minimal memiliki 1 karakter dari !@#$%^&*()_+"),
    confirmPassword: z.string().min(1, "Konfirmasi password wajib diisi")
  })
  .refine((data) => data.newPassword !== data.oldPassword, {
    message: "Password baru tidak boleh sama dengan password lama",
    path: ["newPassword"]
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Password tidak sama",
    path: ["confirmPassword"]
  })

type FormValues = z.infer<typeof changePasswordSchema>

type FieldName = keyof FormValues

const fields: { name: FieldName; label: string; placeholder: string }[] = [
  { name: "oldPassword", label: "Password Lama", placeholder: "Masukkan password lama" },
  { name: "newPassword", label: "Password Baru", placeholder: "Masukkan password baru" },
  { name: "confirmPassword", label: "Konfirmasi Password Baru", placeholder: "Ulangi password baru" }
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
    formState: { errors, isSubmitting }
  } = useForm<FormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { oldPassword: "", newPassword: "", confirmPassword: "" }
  })

  const toggleVisible = (name: FieldName) => setVisible((prev) => ({ ...prev, [name]: !prev[name] }))

  const onSubmit = async (data: FormValues) => {
    // TODO: panggil API ubah password (backend yang memverifikasi password lama)
    // await changePassword({ oldPassword: data.oldPassword, newPassword: data.newPassword })
    router.back()
  }

  return (
    <>
      <SafeAreaView className="flex-1 bg-background">
        <View className="flex-1 bg-background">
          <View className="w-full flex-row items-center gap-4 border-b border-border/40  px-3 py-2 pb-4">
            <TouchableOpacity
              onPress={() => router.back()}
              className="h-10 w-10 items-center justify-center rounded-xl border border-border/50 bg-surface"
            >
              <Ionicons
                name="chevron-back"
                size={20}
                color="white"
              />
            </TouchableOpacity>
            <Text className="text-xl font-bold text-text-primary">Ubah Kata Sandi</Text>
          </View>
          <View className="flex items-center justify-start gap-8">
            {/* Header */}
            <View className="w-[345] flex-row items-center gap-6">
              <View className="flex h-[76] w-[76] items-center justify-center rounded-2xl bg-white/10 shadow-xl">
                <View className="flex h-[56] w-[56] items-center justify-center rounded-full border border-dashed border-[#FF6B00]">
                  <MaterialIcons
                    name="lock"
                    size={40}
                    color="#FF6B00"
                  />
                </View>
              </View>
              <View className="flex w-[340]  gap-1">
                <Text className="text-3xl font-bold text-text-body">Lindungi akunmu</Text>
                <Text className="w-[280] text-sm leading-6 text-[#E2BFB0]">
                  Masukkan password lama kamu, lalu buat password baru yang lebih aman.
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
                        placeholder={placeholder}
                        error={errors[name]?.message}
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

            {/* Submit */}
            <View>
              <AuthButton
                label="Simpan Password Baru"
                onPress={handleSubmit(onSubmit)}
              />
            </View>
          </View>
        </View>
      </SafeAreaView>
    </>
  )
}
