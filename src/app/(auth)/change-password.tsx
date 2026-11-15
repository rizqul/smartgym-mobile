import { AuthButton } from "@/components/auth/authButton"
import { AuthTextField } from "@/components/auth/authTextField"
import { Entypo, Ionicons, MaterialIcons } from "@expo/vector-icons"
import AntDesign from "@expo/vector-icons/AntDesign"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "expo-router"
import React, { useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { Pressable, Text, TouchableOpacity, View } from "react-native"
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
  .refine((data) => data.newPassword !== data.confirmPassword, {
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
    formState: { errors, isSubmitting }
  } = useForm<FormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { oldPassword: "", newPassword: "", confirmPassword: "" }
  })

  const toggleVisible = (name: FieldName) => setVisible((prev) => ({ ...prev, [name]: !prev[name] }))

  const onSubmit = async (data: FormValues) => {
    // TODO: panggil API ubah Kata Sandi (backend yang memverifikasi Kata Sandi lama)
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
                    size={25}
                    color="#FF6B00"
                  />
                </View>
              </View>
              <View className="flex w-[340]  gap-1">
                <Text className="text-3xl font-bold text-text-body">Lindungi akunmu</Text>
                <Text className="w-[280] text-sm leading-6 text-[#E2BFB0]">
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
            <View className="flex w-[340] items-center gap-3 rounded-md bg-surface px-4 py-4">
              <View className="w-full flex-row items-center gap-2">
                {errors.newPassword?.message === "Panjang minimal 8 karakter" ? (
                  <AntDesign
                    name="close-circle"
                    size={18}
                    color="#EF4444"
                  />
                ) : (
                  <AntDesign
                    name="check-circle"
                    size={18}
                    color="#FF6B00"
                  />
                )}
                <Text className="text-xs font-semibold text-[#A98A7D]">Panjang minimal 8 karakter</Text>
              </View>
              <View className="w-full flex-row items-center gap-2">
                {errors.newPassword?.message === "Minimal ada 1 huruf kecil" ? (
                  <AntDesign
                    name="close-circle"
                    size={18}
                    color="#EF4444"
                  />
                ) : (
                  <AntDesign
                    name="check-circle"
                    size={18}
                    color="#FF6B00"
                  />
                )}
                <Text className="text-xs font-semibold text-[#A98A7D]">Minimal ada 1 huruf kecil</Text>
              </View>
              <View className="w-full flex-row items-center gap-2">
                {errors.newPassword?.message === "Minimal ada 1 angka" ? (
                  <AntDesign
                    name="close-circle"
                    size={18}
                    color="#EF4444"
                  />
                ) : (
                  <AntDesign
                    name="check-circle"
                    size={18}
                    color="#FF6B00"
                  />
                )}
                <Text className="text-xs font-semibold text-[#A98A7D]">"Panjang minimal 8 karakter"</Text>
              </View>
              <View className="w-full flex-row items-center gap-2">
                {errors.newPassword?.message === "Minimal memiliki 1 karakter dari !@#$%^&*()_+" ? (
                  <AntDesign
                    name="close-circle"
                    size={18}
                    color="#EF4444"
                  />
                ) : (
                  <AntDesign
                    name="check-circle"
                    size={18}
                    color="#FF6B00"
                  />
                )}
                <Text className="text-xs font-semibold text-[#A98A7D]">Minimal memiliki 1 karakter dari !@#$%^&*()_+</Text>
              </View>
              <View className="w-full flex-row items-center gap-2">
                {errors.newPassword?.message === "Kata sandi baru tidak boleh sama dengan Kata sandi lama" ? (
                  <AntDesign
                    name="close-circle"
                    size={18}
                    color="#EF4444"
                  />
                ) : (
                  <AntDesign
                    name="check-circle"
                    size={18}
                    color="#FF6B00"
                  />
                )}
                <Text className="text-xs font-semibold text-[#A98A7D]">Kata sandi baru tidak boleh sama dengan Kata sandi lama</Text>
              </View>
              <View className="w-full flex-row items-center gap-2">
                {errors.confirmPassword?.message === "Kata Sandi Tidak Sama" ? (
                  <AntDesign
                    name="close-circle"
                    size={18}
                    color="#EF4444"
                  />
                ) : (
                  <AntDesign
                    name="check-circle"
                    size={18}
                    color="#FF6B00"
                  />
                )}
                <Text className="text-xs font-semibold text-[#A98A7D]">Kata Sandi Tidak Sama</Text>
              </View>
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
