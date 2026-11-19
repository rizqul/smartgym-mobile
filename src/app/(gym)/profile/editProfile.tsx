import { AuthButton } from "@/components/auth/authButton"
import { AuthTextField } from "@/components/auth/authTextField"
import HeaderNavigation from "@/components/gym/templates/headerNavigation"
import { useAuth } from "@/context/AuthContext"
import { updateProfile } from "@/service/user.service"
import { Ionicons } from "@expo/vector-icons"
import { zodResolver } from "@hookform/resolvers/zod"
import React from "react"
import { Controller, useForm } from "react-hook-form"
import { Image, ScrollView, StatusBar, Text, TouchableOpacity, View } from "react-native"
import { ALERT_TYPE, Toast } from "react-native-alert-notification"
import { SafeAreaView } from "react-native-safe-area-context"
import { z } from "zod"

const updateProfileSchema = z.object({
  fullname: z.string().min(4, "Panjang minimal 4 karakter"),
  phoneNumber: z
    .string()
    .min(1, "Nomor HP wajib diisi")
    .regex(/^(\+62|62|0)8[1-9][0-9]{6,10}$/, "Format nomor HP tidak valid (contoh: 081234567890 atau +6281234567890)")
})

type FormValues = z.infer<typeof updateProfileSchema>

export default function EditProfile() {
  const { user } = useAuth()
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<FormValues>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: { fullname: user?.name, phoneNumber: user?.phoneNumber }
  })

  const onSubmit = async (data: FormValues) => {
    try {
      await updateProfile(data.fullname, data.phoneNumber, "")
      Toast.show({
        type: ALERT_TYPE.SUCCESS,
        title: "Berhasil",
        textBody: `Data berhasil diperbaharui.`
      })
    } catch (error: any) {
      console.log("error :", error)
      const message = error.response?.data?.message || "Gagal mengirim kode. Coba lagi."
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: "Gagal",
        textBody: message,
        autoClose: 3000
      })
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <StatusBar barStyle="light-content" />

      <HeaderNavigation label="Ubah Profil" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex gap-5 px-5 pb-10 pt-3">
          {/* ================= PROFILE PHOTO SECTION ================= */}
          <View className=" flex-row items-center gap-4">
            <View className="relative">
              <Image
                source={{ uri: "https://i.pravatar.cc/150?img=11" }}
                className="h-[72px] w-[72px] rounded-xl border border-border"
              />
              {/* Camera Button Overlay */}
              <TouchableOpacity className="absolute -bottom-2 -right-2 rounded-lg border-2 border-background bg-primary p-2">
                <Ionicons
                  name="camera"
                  size={16}
                  color="white"
                />
              </TouchableOpacity>
            </View>
            <View>
              <Text className="mb-0.5 text-lg font-bold text-text-primary">Dhafin Rizky</Text>
              <Text className="mb-1.5 text-sm text-text-secondary">ID: SG-88294</Text>
              <TouchableOpacity>
                <Text className="text-xs font-semibold text-primary">Ubah foto profil</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* ================= FORM SECTION ================= */}
          <View className="mt-5 items-center">
            <Controller
              control={control}
              name="fullname"
              render={({ field: { value, onChange, onBlur } }) => (
                <AuthTextField
                  label="Nama Lengkap"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholder="Masukkan Email Anda"
                  error={errors.fullname?.message}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              )}
            />
            <Controller
              control={control}
              name="phoneNumber"
              render={({ field: { value, onChange, onBlur } }) => (
                <AuthTextField
                  label="Nomor Telepon"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholder="Masukkan Nomor Telepon Anda"
                  error={errors.phoneNumber?.message}
                />
              )}
            />
          </View>

          {/* ================= SUBMIT BUTTON & FOOTER ================= */}
          <View className="px-6">
            <AuthButton
              onPress={handleSubmit(onSubmit)}
              label="Simpan Perubahan"
            />

            <Text className="mt-4 text-center text-[11px] text-text-secondary">Perubahan akan diterapkan pada profil member.</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
