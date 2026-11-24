import { AuthButton } from "@/components/auth/authButton"
import { AuthTextField } from "@/components/auth/authTextField"
import { useAuth } from "@/context/authContext"
import { updateProfile } from "@/service/user.service"
import { Ionicons } from "@expo/vector-icons"
import { zodResolver } from "@hookform/resolvers/zod"
import * as ImagePicker from "expo-image-picker"
import { router } from "expo-router"
import React, { useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { ActivityIndicator, Image, ScrollView, StatusBar, Text, TouchableOpacity, View } from "react-native"
import { ALERT_TYPE, Toast } from "react-native-alert-notification"
import { SafeAreaView } from "react-native-safe-area-context"
import { z } from "zod"

const updateProfileSchema = z.object({
  fullname: z.string().min(4, "Must be at least 4 characters"),
  phoneNumber: z
    .string()
    .min(1, "Phone number is required")
    .regex(/^(\+62|62|0)8[1-9][0-9]{6,10}$/, "Invalid phone number format (e.g. 081234567890 or +6281234567890)")
})

type FormValues = z.infer<typeof updateProfileSchema>

// ================= SMALL LOCAL COMPONENT =================
type SectionHeaderProps = {
  icon: React.ComponentProps<typeof Ionicons>["name"]
  title: string
  subtitle: string
}

const SectionHeader = ({ icon, title, subtitle }: SectionHeaderProps) => (
  <View className="mb-4 flex-row items-center gap-3">
    <View className="h-10 w-10 items-center justify-center rounded-xl border border-primary/30 bg-primary/15">
      <Ionicons
        name={icon}
        size={20}
        color="#FF6B00"
      />
    </View>
    <View className="flex-1">
      <Text className="font-inter text-base font-bold text-text-primary">{title}</Text>
      <Text className="font-inter text-sm text-text-subdued">{subtitle}</Text>
    </View>
  </View>
)

// ================= SCREEN =================
export default function EditProfile() {
  const { user, refreshUser } = useAuth()
  const [uploading, setUploading] = useState(false)
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<FormValues>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: { fullname: user?.name, phoneNumber: user?.phoneNumber }
  })

  const uploadPhoto = async () => {
    // 1. Pick an image from the gallery
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
        title: "File Too Large",
        textBody: "The photo must not be larger than 2MB!",
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
        title: "Invalid Format",
        textBody: "The photo must be a png, jpg, or jpeg file!",
        autoClose: 3000
      })
      return
    }

    try {
      setUploading(true)
      await updateProfile(user?.name!, user?.phoneNumber!, {
        uri: uri,
        name: fileName,
        type: mimeType
      })

      Toast.show({
        type: ALERT_TYPE.SUCCESS,
        title: "Success",
        textBody: "Profile photo updated successfully.",
        autoClose: 3000
      })

      await refreshUser()
    } catch (error: any) {
      const message = error.response?.data?.message || "Failed to upload the image. Please try again."
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: "Failed",
        textBody: message,
        autoClose: 3000
      })
    } finally {
      setUploading(false)
    }
  }

  const onSubmit = async (data: FormValues) => {
    try {
      await updateProfile(data.fullname, data.phoneNumber)
      Toast.show({
        type: ALERT_TYPE.SUCCESS,
        title: "Success",
        textBody: "Your profile has been updated.",
        autoClose: 3000
      })
      await refreshUser()
    } catch (error: any) {
      const message = error.response?.data?.message || "Failed to update your profile. Please try again."
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: "Failed",
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
        {/* ================= HEADER ================= */}
        <View className="overflow-hidden rounded-b-3xl border-b border-border bg-surface px-5 pb-8 pt-3 shadow-lg">
          {/* Decorative glow */}
          <View className="absolute -right-16 -top-16 h-52 w-52 rounded-full bg-primary/10" />
          <View className="absolute -left-12 top-24 h-36 w-36 rounded-full bg-secondary/5" />
          <View className="absolute right-6 top-40 h-16 w-16 rounded-full bg-info/10" />

          {/* Back button on the left, title centered */}
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
            <Text className="font-inter text-lg font-bold tracking-wide text-text-primary">Edit Profile</Text>
          </View>

          {/* Profile photo */}
          <View className="mt-6 items-center gap-5">
            <View className="relative">
              {/* Outer ring */}
              <View className="rounded-full border-2 border-primary bg-primary/10 p-1 shadow-lg shadow-primary">
                <Image
                  source={{ uri: user?.profileUrl }}
                  className="h-[108px] w-[108px] rounded-full bg-background"
                />
                {uploading ? (
                  <View className="absolute inset-1 items-center justify-center rounded-full bg-background/70">
                    <ActivityIndicator color="#FF6B00" />
                  </View>
                ) : null}
              </View>

              {/* Edit photo button */}
              <TouchableOpacity
                onPress={uploadPhoto}
                disabled={uploading}
                activeOpacity={0.8}
                className="absolute bottom-0 right-0 h-9 w-9 items-center justify-center rounded-full border-[3px] border-surface bg-primary shadow-md"
              >
                <Ionicons
                  name="pencil"
                  size={15}
                  color="#1A1C20"
                />
              </TouchableOpacity>
            </View>

            <View className="items-center gap-2">
              <Text className="font-inter text-2xl font-bold tracking-tight text-text-primary">{user?.name}</Text>
              <View className="flex-row items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5">
                <Ionicons
                  name="mail-outline"
                  size={14}
                  color="#FFB693"
                />
                <Text className="font-inter text-sm text-accent">{user?.email}</Text>
              </View>
              <Text className="font-inter text-xs text-text-muted">JPG, JPEG or PNG • Max 2MB</Text>
            </View>
          </View>
        </View>

        {/* ================= BODY ================= */}
        <View className="mt-6 gap-6 px-5 pb-10">
          {/* ---------- SECTION: BASIC INFORMATION ---------- */}
          <View>
            <SectionHeader
              icon="person-outline"
              title="Basic Information"
              subtitle="Your name and contact details"
            />

            <View className="gap-4 rounded-2xl border border-border/50 bg-card p-4">
              {/* Email (read-only) */}
              <View>
                <View className="mb-2 flex-row items-center justify-between px-2">
                  <Text className="font-inter text-sm font-semibold text-text-body">Email</Text>
                  <View className="flex-row items-center gap-1 rounded-md bg-text-muted/15 px-2 py-0.5">
                    <Ionicons
                      name="lock-closed"
                      size={10}
                      color="#9CA3AF"
                    />
                    <Text className="font-inter text-xs font-semibold text-text-subdued">Locked</Text>
                  </View>
                </View>
                <View className="w-full flex-row items-center gap-3 rounded-xl border border-border/80 bg-surface px-4 py-5 opacity-70">
                  <Ionicons
                    name="mail-outline"
                    size={18}
                    color="#9CA3AF"
                  />
                  <Text className="flex-1 font-inter text-base text-text-subdued">{user?.email}</Text>
                </View>
              </View>

              <Controller
                control={control}
                name="fullname"
                render={({ field: { value, onChange, onBlur } }) => (
                  <AuthTextField
                    label="Full Name"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder="Enter your name"
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
                    label="Phone Number"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder="e.g. 081234567890"
                    error={errors.phoneNumber?.message}
                    keyboardType="phone-pad"
                  />
                )}
              />
            </View>
          </View>

          {/* ---------- INFO NOTE ---------- */}
          <View className="flex-row items-start gap-3 rounded-2xl border border-info/20 bg-info/10 p-4">
            <Ionicons
              name="information-circle"
              size={20}
              color="#60A5FA"
            />
            <Text className="flex-1 font-inter text-sm leading-5 text-text-body">Changes will be applied to your member profile.</Text>
          </View>

          {/* ---------- SUBMIT ---------- */}
          <AuthButton
            onPress={handleSubmit(onSubmit)}
            label="Save Changes"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
