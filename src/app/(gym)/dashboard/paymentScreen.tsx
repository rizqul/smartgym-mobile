import * as ExpoLinking from "expo-linking"
import { useLocalSearchParams, useRouter } from "expo-router"
import { Alert } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { WebView } from "react-native-webview"

const MEMBERSHIP_REDIRECT_PATH = "/midtrans/membership"

export default function PaymentScreen() {
  const { paymentUrl } = useLocalSearchParams<{ paymentUrl: string }>()
  const router = useRouter()

  return (
    <SafeAreaView className="flex-1">
      <WebView
        source={{ uri: paymentUrl }}
        onShouldStartLoadWithRequest={(req) => {
          if (!req.url.includes(MEMBERSHIP_REDIRECT_PATH)) return true

          const { queryParams } = ExpoLinking.parse(req.url)
          const status = queryParams?.transaction_status

          if (status === "settlement" || status === "capture") {
            Alert.alert("Berhasil", "Pembayaran berhasil, membership kamu segera aktif.")
          } else if (status === "pending") {
            Alert.alert("Menunggu pembayaran", "Selesaikan pembayaran kamu dulu.")
          } else {
            Alert.alert("Gagal", "Pembayaran tidak berhasil atau sudah kedaluwarsa.")
          }

          router.dismissTo("/(gym)/navigation/profile") // ganti ke screen yang sudah ada
          return false // jangan load endpoint backend di WebView
        }}
      />
    </SafeAreaView>
  )
}
