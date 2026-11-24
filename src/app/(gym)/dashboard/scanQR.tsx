import HeaderNavigation from "@/components/gym/templates/headerNavigation"
import { scanQr } from "@/service/scan.service"
import { setActiveCheckin } from "@/store/slice/checkinSlice"
import { AppDispatch } from "@/store/store"
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons"
import { CameraView, useCameraPermissions } from "expo-camera"
import { useRouter } from "expo-router"
import React, { useState } from "react"
import { ScrollView, StatusBar, Text, TouchableOpacity, View } from "react-native"
import { ALERT_TYPE, Toast } from "react-native-alert-notification"
import { SafeAreaView } from "react-native-safe-area-context"
import { useDispatch } from "react-redux"

export default function ScanQR() {
  const dispatch = useDispatch<AppDispatch>()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [permission, requestPermission] = useCameraPermissions()
  const [scanned, setScanned] = useState(false)
  const [flashOn, setFlashOn] = useState(false)

  // load camera
  if (!permission) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-background">
        <Text className="text-text-primary">Memuat kamera...</Text>
      </SafeAreaView>
    )
  }

  const handleMountError = (error: any) => {
    console.error("Camera Mount Error:", error)
    Toast.show({
      type: ALERT_TYPE.DANGER,
      title: "Kamera Tidak Tersedia",
      textBody: "Pastikan tidak ada aplikasi lain yang menggunakan kamera dan coba lagi."
    })
  }

  if (!permission.granted) {
    return (
      <SafeAreaView className="flex-1 bg-background">
        <HeaderNavigation label="Scan QR" />
        <View className="flex-1 items-center justify-center px-10">
          <MaterialCommunityIcons
            name="camera-off"
            size={64}
            color="#B8BDC7"
            className="mb-4"
          />
          <Text className="mb-2 text-center text-lg font-bold text-text-primary">Akses Kamera Dibutuhkan</Text>
          <Text className="mb-6 text-center text-sm text-text-secondary">
            Aplikasi membutuhkan akses kamera untuk memindai QR code di pintu masuk gym.
          </Text>
          <TouchableOpacity
            onPress={requestPermission}
            className="rounded-xl bg-primary px-6 py-3"
          >
            <Text className="font-bold text-white">Izinkan Akses Kamera</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    )
  }

  const handleBarCodeScanned = async ({ type, data }: { type: string; data: string }) => {
    if (scanned || isLoading) return // Cegah scan ganda
    setScanned(true)
    setIsLoading(true)

    try {
      const res = await scanQr(data)
      console.log(res);
      if (res.status === "ACCEPTED") {
        dispatch(setActiveCheckin(res))
        Toast.show({
          type: ALERT_TYPE.SUCCESS,
          title: "Akses Diberikan",
          textBody: `Selamat berlatih, ${res.member.name}!`,
          autoClose: 5000
        })
        router.push("/(gym)/navigation/dashboard")
      } else {
        Toast.show({
          type: ALERT_TYPE.DANGER,
          title: "Akses Ditolak",
          textBody: res.denialReason || "Membership Anda tidak aktif atau telah kedaluwarsa.",
          autoClose: 5000
        })
      }
    } catch (error: any) {
      console.log("Error Scan QR:", error.response?.data || error.message)

      const errorMessage = error.response?.data?.message || "Gagal terhubung ke server. Periksa koneksi internet Anda."

      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: "Koneksi Gagal",
        textBody: errorMessage,
        autoClose: 4000
      })
    } finally {
      setIsLoading(false)
      setTimeout(() => {
        setScanned(false)
      }, 2000)
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <StatusBar barStyle="light-content" />

      {/* HEADER */}
      <HeaderNavigation label="Scan QR" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="px-5 pt-6 pb-10 items-center"
      >
        {/* TEXT SECTION */}
        <Text className="mb-2 text-[10px] font-bold uppercase tracking-widest text-primary">Check-In SmartGym</Text>
        <Text className="mb-2 text-center text-2xl font-bold text-text-primary">Siap untuk latihan?</Text>
        <Text className="mb-8 px-4 text-center text-sm text-text-secondary">
          Pindai QR code di pintu masuk gym untuk memulai sesi latihanmu.
        </Text>

        {/* SCANNER AREA (CAMERA VIEW) */}
        <View className="relative mb-8 aspect-square w-full overflow-hidden rounded-3xl border border-border/30 bg-black">
          <CameraView
            style={{ flex: 1 }}
            facing="back"
            enableTorch={flashOn}
            barcodeScannerSettings={{
              barcodeTypes: ["qr"]
            }}
            onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
            onMountError={handleMountError}
          />

          {/* OVERLAY UI ) */}
          <View className="pointer-events-none absolute inset-0 items-center justify-center">
            {/* Grid */}
            <View className="absolute inset-0 flex-row flex-wrap opacity-20">
              {Array.from({ length: 16 }).map((_, i) => (
                <View
                  key={i}
                  className="h-1/4 w-1/4 border border-white/20"
                />
              ))}
            </View>

            {/* Corner Brackets  */}
            <View className="absolute left-6 top-6 h-10 w-10 rounded-tl-xl border-l-4 border-t-4 border-primary" />
            <View className="absolute right-6 top-6 h-10 w-10 rounded-tr-xl border-r-4 border-t-4 border-primary" />
            <View className="absolute bottom-6 left-6 h-10 w-10 rounded-bl-xl border-b-4 border-l-4 border-primary" />
            <View className="absolute bottom-6 right-6 h-10 w-10 rounded-br-xl border-b-4 border-r-4 border-primary" />

            {/* Garis Scan  */}
            <View className="items-center">
              <View className="mt-2 h-1 w-48 bg-primary shadow-sm shadow-primary" />
            </View>

            <Text className="absolute bottom-20 mt-6 text-xs text-white">Posisikan QR di dalam bingkai</Text>
          </View>

          {/* Floating Button */}
          <TouchableOpacity className="absolute bottom-6 flex-row items-center gap-2 rounded-full border border-white/20 bg-black/60 px-4 py-2">
            <MaterialCommunityIcons
              name="focus-field"
              size={16}
              color="white"
            />
            <Text className="text-xs font-semibold text-white">Pindai otomatis</Text>
          </TouchableOpacity>
        </View>

        {/* ACTION BUTTONS (FLASHLIGHT) */}
        <View className="mb-8 flex-row gap-6">
          <TouchableOpacity
            className="items-center gap-2"
            onPress={() => setFlashOn(!flashOn)}
          >
            <View
              className={`h-16 w-16 items-center justify-center rounded-2xl border ${flashOn ? "border-primary bg-primary/20" : "border-border/50 bg-surface"}`}
            >
              <Ionicons
                name="flash"
                size={24}
                color={flashOn ? "#FF6B00" : "white"}
              />
            </View>
            <Text className={`text-xs font-medium ${flashOn ? "text-primary" : "text-text-primary"}`}>Senter</Text>
          </TouchableOpacity>
        </View>

        {/* WARNING / INFO BOX */}
        <View className="mb-6 w-full flex-row items-start gap-3 rounded-2xl bg-surface p-4">
          <Ionicons
            name="information-circle-outline"
            size={20}
            color="#FF6B00"
          />
          <View className="flex-1">
            <Text className="mb-1 text-xs font-bold text-text-primary">QR code tidak terbaca?</Text>
            <Text className="text-[11px] leading-4 text-text-secondary">
              Pastikan pencahayaan cukup dan kamera menghadap lurus ke QR code.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
