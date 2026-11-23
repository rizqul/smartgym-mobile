import { AuthButton } from "@/components/auth/authButton"
import { AuthTextField } from "@/components/auth/authTextField"
import { useAuth } from "@/context/AuthContext"
import { updateProfile } from "@/service/user.service"
import { Ionicons } from "@expo/vector-icons"
import { zodResolver } from "@hookform/resolvers/zod"
import * as ImagePicker from "expo-image-picker"
import { router } from "expo-router"
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
      allowsEditing: true,
      aspect: [1, 1],
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

      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View className=" border-b border-border bg-surface px-5 pb-8 pt-3 shadow-lg">
          {/* Header: tombol back di kiri, judul tepat di tengah */}
          <View className="h-11 flex-row items-center justify-center">
            <TouchableOpacity
              onPress={() => router.back()}
              activeOpacity={0.7}
              className="absolute left-0 h-10 w-10 items-center justify-center rounded-full border border-border bg-background"
            >
              <Ionicons
                name="arrow-back"
                size={22}
                color="white"
              />
            </TouchableOpacity>
            <Text className="font-inter text-lg font-bold tracking-wide text-text-primary">Profil</Text>
          </View>

          {/* Foto profil */}
          <View className="mt-6 items-center gap-5">
            <View className="relative">
              {/* Ring luar berwarna primary */}
              <View className="rounded-full border-2 border-primary p-1 shadow-lg shadow-primary">
                <Image
                  source={{ uri: user?.profileUrl }}
                  className="h-[108px] w-[108px] rounded-full bg-background"
                />
              </View>
              {/* Camera Button Overlay */}
              <TouchableOpacity
                onPress={() => uploadPhoto()}
                activeOpacity={0.8}
                className="absolute bottom-0 right-0 h-9 w-9 flex-row items-center justify-center rounded-full border-[3px] border-surface bg-primary shadow-md"
              >
                <Ionicons
                  name="pencil"
                  size={15}
                  color="#1A1C20"
                />
              </TouchableOpacity>
            </View>

            <View className="items-center gap-2">
              <Text className="text-2xl font-bold tracking-tight text-text-primary">{user?.name}</Text>
              <View className="rounded-full border border-border bg-background px-4 py-1.5">
                <Text className="font-inter text-xs text-text-secondary">{user?.email}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Body */}
        <View className="mt-6 px-5 pb-6">
          {/* ================= SECTION 1: INFORMASI DASAR ================= */}
          <View className="mb-6">
            <View className="mb-4 flex-row items-center gap-2">
              <Ionicons
                name="person-outline"
                size={18}
                color="#FF6B00"
              />
              <Text className="text-base font-bold text-text-primary">Informasi Dasar</Text>
            </View>

            <View className="gap-4 rounded-2xl border border-border/50 bg-card p-4">
              <View className="">
                <View className="flex-row items-center justify-between">
                  <View className="flex-row gap-2 px-2">
                    <Text className="mb-2 font-inter text-sm font-semibold text-text-body">Email</Text>
                  </View>
                </View>
                <View className="w-full flex-row items-center rounded-xl border border-border/80 bg-surface px-4 py-5 opacity-70">
                  <Text className="font-inter text-base  text-text-primary ">{user?.email}</Text>
                </View>
              </View>

              <Controller
                control={control}
                name="fullname"
                render={({ field: { value, onChange, onBlur } }) => (
                  <AuthTextField
                    label="Nama Lengkap"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder="Masukkan Nama Anda"
                    error={errors.fullname?.message}
                    autoCapitalize="words"
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
                    placeholder="Contoh: 081234567890"
                    error={errors.phoneNumber?.message}
                    keyboardType="phone-pad"
                  />
                )}
              />
            </View>
          </View>

          {/* ================= SUBMIT BUTTON & FOOTER ================= */}
          <View className="">
            <AuthButton
              onPress={handleSubmit(onSubmit)}
              label="Simpan Perubahan"
            />

            <Text className="mt-5 text-center text-[11px] leading-4 text-text-secondary">
              Perubahan akan diterapkan pada profil member.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
