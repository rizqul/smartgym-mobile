import { Ionicons } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import React from "react"
import { Image, ScrollView, StatusBar, Text, TextInput, TouchableOpacity, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

export default function EditProfile() {
  const router = useRouter()

  return (
    <SafeAreaView className="flex-1 bg-background">
      <StatusBar barStyle="light-content" />

      <View className="flex-row items-center gap-4 border-b border-border/40 px-5 py-4">
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
        <Text className="text-xl font-bold text-text-primary">Edit Profil</Text>
      </View>

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
          <View className="">
            <Text className="mb-5 text-base font-bold text-text-primary">Informasi pribadi</Text>

            <View className="gap-5">
              {/* Input Nama */}
              <View className="gap-2">
                <Text className="text-xs font-medium text-text-secondary">Nama lengkap</Text>
                <TextInput
                  className="rounded-xl border border-border bg-field-primary px-4 py-3.5 text-sm text-text-primary"
                  defaultValue="Dhafin Rizky"
                  placeholderTextColor="#A98A7D"
                />
              </View>

              {/* Input Email */}
              <View className="gap-2">
                <Text className="text-xs font-medium text-text-secondary">Email</Text>
                <TextInput
                  className="rounded-xl border border-border bg-field-primary px-4 py-3.5 text-sm text-text-primary"
                  placeholder="Masukkan alamat email"
                  placeholderTextColor="#A98A7D"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              {/* Input Nomor Telepon */}
              <View className="gap-2">
                <Text className="text-xs font-medium text-text-secondary">Nomor telepon</Text>
                <TextInput
                  className="rounded-xl border border-border bg-field-primary px-4 py-3.5 text-sm text-text-primary"
                  placeholder="Masukkan nomor telepon"
                  placeholderTextColor="#A98A7D"
                  keyboardType="phone-pad"
                />
              </View>
            </View>
          </View>

          {/* ================= SUBMIT BUTTON & FOOTER ================= */}
          <View className="">
            <TouchableOpacity className="w-full items-center justify-center rounded-xl bg-primary py-4 shadow-lg shadow-primary/20">
              <Text className="text-sm font-bold text-background">Simpan Perubahan</Text>
            </TouchableOpacity>

            <Text className="mt-4 text-center text-[11px] text-text-secondary">Perubahan akan diterapkan pada profil member.</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
