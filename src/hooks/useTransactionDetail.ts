import { useAuth } from "@/context/authContext"
import { cancelTransaction, checkTransactionStatus, getTransactionById } from "@/service/transaction.service"
import { TransactionsResponse } from "@/type/Transaction.type"
import { getStatusUI } from "@/utils/transactionHelper"
import { buildReceiptHtml } from "@/utils/transactionReceipt"
import * as Print from "expo-print"
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router"
import { useCallback, useEffect, useRef, useState } from "react"
import { ALERT_TYPE, Toast } from "react-native-alert-notification"

export function useTransactionDetail() {
  const router = useRouter()
  const { id } = useLocalSearchParams<{ id: string }>()
  const { refreshUser } = useAuth()

  const [data, setData] = useState<TransactionsResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [checking, setChecking] = useState(false)
  const [cancelling, setCancelling] = useState(false)
  const [now, setNow] = useState(() => Date.now())
  const expiryChecked = useRef(false)
  const [downloading, setDownloading] = useState(false)
  const [showCancel, setShowCancel] = useState(false)

  const isPending = data?.status === "PENDING"

  // ---------- LOAD ----------
  const load = useCallback(async (): Promise<TransactionsResponse | null> => {
    try {
      const res = await getTransactionById(id)
      refreshUser()
      setData(res.data)
      setError(null)
      return res.data
    } catch (e: any) {
      setError(e.response?.data?.message || "Failed to load transaction.")
      return null
    } finally {
      setLoading(false)
    }
  }, [id])

  useFocusEffect(
    useCallback(() => {
      load()
    }, [load])
  )

  const retry = () => {
    setLoading(true)
    load()
  }

  // ---------- COUNTDOWN ----------
  useEffect(() => {
    if (!isPending) return
    setNow(Date.now())
    const timer = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(timer)
  }, [isPending])

  const remaining = data?.expiredAt ? Math.max(0, Math.floor((new Date(data.expiredAt).getTime() - now) / 1000)) : 0
  const isTimeUp = isPending && !!data?.expiredAt && remaining === 0

  // ---------- CHECK STATUS ----------
  const handleCheckStatus = async (silent = false) => {
    if (!silent) setChecking(true)
    let message: string | null = null
    try {
      await checkTransactionStatus(data?.orderId!)
    } catch (e: any) {
      message = e.response?.data?.message || "Failed to check status. Please try again."
    }

    const fresh = await load()

    if (!silent) {
      setChecking(false)
      if (fresh?.status === "SUCCESS") {
        Toast.show({ type: ALERT_TYPE.SUCCESS, title: "Success", textBody: "Payment has been received.", autoClose: 3000 })
      } else if (message) {
        Toast.show({ type: ALERT_TYPE.WARNING, title: "Transaction Status", textBody: message, autoClose: 3000 })
      } else if (fresh?.status === "PENDING") {
        Toast.show({ type: ALERT_TYPE.WARNING, title: "No Payment Yet", textBody: "Payment has not been received.", autoClose: 3000 })
      }
    }
  }

  useEffect(() => {
    if (isTimeUp && !expiryChecked.current) {
      expiryChecked.current = true
      void handleCheckStatus(true)
    }
  }, [isTimeUp])

  // ---------- PAY ----------
  const handlePay = () => {
    if (!data?.paymentUrl) {
      Toast.show({ type: ALERT_TYPE.DANGER, title: "Failed", textBody: "Payment link is not available.", autoClose: 3000 })
      return
    }
    router.push({
      pathname: "/(gym)/dashboard/paymentScreen",
      params: {
        paymentUrl: data.paymentUrl,
        type: data.type === "PT_BOOKING" ? "pt-booking" : "membership",
        id: data.orderId
      }
    })
  }

  // ---------- CANCEL ----------
  const handleCancel = () => setShowCancel(true)

  const confirmCancel = async () => {
    setShowCancel(false)
    try {
      setCancelling(true)
      await cancelTransaction(data?.orderId!, data?.token!)
      Toast.show({ type: ALERT_TYPE.SUCCESS, title: "Success", textBody: "Transaction cancelled.", autoClose: 3000 })
      await load()
    } catch (e: any) {
      const message = e.response?.data?.message || "Failed to cancel transaction. Please try again."
      Toast.show({ type: ALERT_TYPE.DANGER, title: "Failed", textBody: message, autoClose: 3000 })
    } finally {
      setCancelling(false)
    }
  }

  const handleDownload = async () => {
    if (!data || downloading) return
    setDownloading(true)
    try {
      const html = buildReceiptHtml({
        id: data.id,
        name: data.name,
        amount: data.amount,
        status: data.status,
        typeLabel: data.type === "PT_BOOKING" ? "Trainer Booking" : "Membership",
        statusLabel: getStatusUI(data.status).label,
        createdAt: data.createdAt,
        paymentMethod: data.paymentType
      })

      await Print.printAsync({ html })
    } catch (e: any) {
      const message = "Failed to download receipt. Please try again."
      Toast.show({ type: ALERT_TYPE.DANGER, title: "Failed", textBody: message, autoClose: 3000 })
    } finally {
      setDownloading(false)
    }
  }

  return {
    data,
    loading,
    error,
    checking,
    cancelling,
    isPending,
    remaining,
    isTimeUp,
    retry,
    handleCheckStatus,
    handlePay,
    handleCancel,
    showCancel,
    setShowCancel,
    confirmCancel,
    downloading,
    handleDownload
  }
}
