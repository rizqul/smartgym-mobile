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
        <Text className="font-inter text-text-primary">Loading camera...</Text>
      </SafeAreaView>
    )
  }

  const handleMountError = (error: any) => {
    Toast.show({
      type: ALERT_TYPE.DANGER,
      title: "Camera Unavailable",
      textBody: "Make sure no other app is using the camera, then try again."
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
          <Text className="mb-2 text-center font-inter text-lg font-bold text-text-primary">Camera Access Required</Text>
          <Text className="mb-6 text-center font-inter text-sm text-text-secondary">
            The app needs camera access to scan the QR code at the gym entrance.
          </Text>
          <TouchableOpacity
            onPress={requestPermission}
            className="rounded-xl bg-primary px-6 py-3"
          >
            <Text className="font-inter font-bold text-white">Allow Camera Access</Text>
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
      if (res.status === "ACCEPTED") {
        dispatch(setActiveCheckin(res))
        Toast.show({
          type: ALERT_TYPE.SUCCESS,
          title: "Access Granted",
          textBody: `Enjoy your workout, ${res.member.name}!`,
          autoClose: 5000
        })
        router.push("/(gym)/navigation/dashboard")
      } else {
        Toast.show({
          type: ALERT_TYPE.DANGER,
          title: "Access Denied",
          textBody: res.denialReason || "Your membership is inactive or has expired.",
          autoClose: 5000
        })
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Could not connect to the server. Check your internet connection."

      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: "Connection Failed",
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
        <Text className="mb-2 font-inter text-[10px] font-bold uppercase tracking-widest text-primary">SmartGym Check-In</Text>
        <Text className="mb-2 text-center font-inter text-2xl font-bold text-text-primary">Ready to work out?</Text>
        <Text className="mb-8 px-4 text-center font-inter text-sm text-text-secondary">
          Scan the QR code at the gym entrance to start your workout.
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

            <Text className="absolute bottom-20 mt-6 font-inter text-xs text-white">Position the QR code inside the frame</Text>
          </View>

          {/* Floating Button */}
          <TouchableOpacity className="absolute bottom-6 flex-row items-center gap-2 rounded-full border border-white/20 bg-black/60 px-4 py-2">
            <MaterialCommunityIcons
              name="focus-field"
              size={16}
              color="white"
            />
            <Text className="font-inter text-xs font-semibold text-white">Auto scan</Text>
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
            <Text className={`font-inter text-xs font-medium ${flashOn ? "text-primary" : "text-text-primary"}`}>Flashlight</Text>
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
            <Text className="mb-1 font-inter text-xs font-bold text-text-primary">Can't scan the QR code?</Text>
            <Text className="font-inter text-[11px] leading-4 text-text-secondary">
              Make sure there is enough light and point the camera straight at the QR code.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
