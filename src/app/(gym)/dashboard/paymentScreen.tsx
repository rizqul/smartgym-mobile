import * as ExpoLinking from "expo-linking"
import { useLocalSearchParams, useRouter } from "expo-router"
import { Alert } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { WebView } from "react-native-webview"

const REDIRECT_PATHS = {
  membership: "/midtrans/membership",
  "pt-booking": "/midtrans/pt-booking"
} as const

export default function PaymentScreen() {
  const { paymentUrl, type } = useLocalSearchParams<{ paymentUrl: string; type: keyof typeof REDIRECT_PATHS }>()
  const router = useRouter()
  const redirectPath = REDIRECT_PATHS[type ?? "membership"]

  return (
    <SafeAreaView className="flex-1">
      <WebView
        source={{ uri: paymentUrl }}
        onShouldStartLoadWithRequest={(req) => {
          if (!req.url.includes(redirectPath)) return true

          const { queryParams } = ExpoLinking.parse(req.url)
          const status = queryParams?.transaction_status

          if (status === "settlement" || status === "capture") {
            Alert.alert("Berhasil", "Pembayaran berhasil, membership kamu segera aktif.")
          } else if (status === "pending") {
            Alert.alert("Menunggu pembayaran", "Selesaikan pembayaran kamu dulu.")
          } else {
            Alert.alert("Gagal", "Pembayaran tidak berhasil atau sudah kedaluwarsa.")
          }

          router.dismissTo("/(gym)/navigation/profile")
          return false
        }}
      />
    </SafeAreaView>
  )
}
