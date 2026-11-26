import AppModal, { AppModalVariant } from "@/components/gym/templates/appModal"
import * as ExpoLinking from "expo-linking"
import { useLocalSearchParams, useRouter } from "expo-router"
import { useRef, useState } from "react"
import { SafeAreaView } from "react-native-safe-area-context"
import { WebView } from "react-native-webview"

const REDIRECT_PATHS = {
  membership: "/midtrans/membership",
  "pt-booking": "/midtrans/pt-booking"
} as const

type PaymentResult = {
  variant: AppModalVariant
  title: string
  message: string
}

const getResult = (status: unknown, type: keyof typeof REDIRECT_PATHS): PaymentResult => {
  const isBooking = type === "pt-booking"

  if (status === "settlement" || status === "capture") {
    return {
      variant: "success",
      title: "Payment Successful",
      message: isBooking
        ? "Your payment has been received. Your trainer session is being confirmed."
        : "Your payment has been received. Your membership will be active shortly."
    }
  }

  if (status === "pending") {
    return {
      variant: "warning",
      title: "Waiting for Payment",
      message: "Please complete your payment before it expires. You can check the status from your transaction details."
    }
  }

  return {
    variant: "danger",
    title: "Payment Failed",
    message: "Your payment was unsuccessful or has expired. Please try again."
  }
}

export default function PaymentScreen() {
  const { paymentUrl, type, orderId } = useLocalSearchParams<{ paymentUrl: string; type: keyof typeof REDIRECT_PATHS; orderId: string }>()
  const router = useRouter()
  const paymentType = type ?? "membership"
  const redirectPath = REDIRECT_PATHS[paymentType]

  const [result, setResult] = useState<PaymentResult | null>(null)
  const handled = useRef(false)

  const handleContinue = () => {
    setResult(null)
    router.dismissTo("/(gym)/navigation/dashboard")
    router.push({
      pathname: "/(gym)/profile/transactionDetail",
      params: { id: orderId }
    })
  }

  return (
    <SafeAreaView className="flex-1">
      <WebView
        source={{ uri: paymentUrl }}
        onShouldStartLoadWithRequest={(req) => {
          if (!req.url.includes(redirectPath)) return true

          if (!handled.current) {
            handled.current = true
            const { queryParams } = ExpoLinking.parse(req.url)
            setResult(getResult(queryParams?.transaction_status, paymentType))
          }

          return false
        }}
      />

      <AppModal
        visible={result !== null}
        onClose={handleContinue}
        dismissOnBackdrop={false}
        variant={result?.variant}
        title={result?.title ?? ""}
        message={result?.message}
        primaryLabel="View Transaction"
        onPrimary={handleContinue}
      />
    </SafeAreaView>
  )
}
