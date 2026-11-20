import { AuthButton } from "@/components/auth/authButton"
import { AuthTextField } from "@/components/auth/authTextField"
import HeaderNavigation from "@/components/gym/templates/headerNavigation"
import { useAuth } from "@/context/AuthContext"
import { updateProfile } from "@/service/user.service"
import { Ionicons } from "@expo/vector-icons"
import { zodResolver } from "@hookform/resolvers/zod"
import * as ImagePicker from "expo-image-picker"
import React, { useState } from "react"
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
  const { user, refreshUser } = useAuth()
  const [image, setImage] = useState<string | null>(null)
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<FormValues>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: { fullname: user?.name, phoneNumber: user?.phoneNumber }
  })

  const uploadPhoto = async () => {
    // 1. Pilih gambar dari galeri
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 0.7
    })

    if (result.canceled) return

    const asset = result.assets[0]

    const maxBytes = 2 * 1024 * 1024
    if (asset.fileSize && asset.fileSize > maxBytes) {
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: "Ukuran Terlalu Besar",
        textBody: "Ukuran file photo tidak boleh lebih dari 2MB!",
        autoClose: 3000
      })
      return
    }

    const uri = asset.uri
    const fileName = asset.fileName || uri.split("/").pop() || "photo.jpg"
    const ext = fileName.split(".").pop()?.toLowerCase()

    let mimeType = "image/jpeg"
    if (ext === "png") mimeType = "image/png"
    else if (ext === "jpg") mimeType = "image/jpg"
    else if (ext === "jpeg") mimeType = "image/jpeg"
    else {
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: "Format Tidak Valid",
        textBody: "File photo harus berupa png, jpg, atau jpeg!",
        autoClose: 3000
      })
      return
    }

    try {
      await updateProfile(user?.name!, user?.phoneNumber!, {
        uri: uri,
        name: fileName,
        type: mimeType
      })

      Toast.show({
        type: ALERT_TYPE.SUCCESS,
        title: "Berhasil",
        textBody: `Foto profil berhasil diperbaharui`,
        autoClose: 3000
      })

      await refreshUser()
    } catch (error: any) {
      const message = error.response?.data?.message || "Gagal mengupload gambar. Coba lagi."
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: "Gagal",
        textBody: message,
        autoClose: 3000
      })
    }
  }

  const onSubmit = async (data: FormValues) => {
    try {
      const response = await updateProfile(data.fullname, data.phoneNumber)
      console.log("Data : ", response)
      Toast.show({
        type: ALERT_TYPE.SUCCESS,
        title: "Berhasil",
        textBody: `Data berhasil diperbaharui.`
      })
      await refreshUser()
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
                source={{ uri: user?.profileUrl }}
                className="h-[72px] w-[72px] rounded-xl border border-border"
              />
              {/* Camera Button Overlay */}
              <TouchableOpacity
                onPress={() => uploadPhoto()}
                className="absolute -bottom-2 -right-2 rounded-lg border-2 border-background bg-primary p-2"
              >
                <Ionicons
                  name="camera"
                  size={16}
                  color="white"
                />
              </TouchableOpacity>
            </View>
            <View>
              <Text className="mb-0.5 text-lg font-bold text-text-primary">{user?.name}</Text>
              <Text className="mb-1.5 text-sm text-text-secondary">ID: SG-88294</Text>
              <TouchableOpacity onPress={() => uploadPhoto()}>
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
