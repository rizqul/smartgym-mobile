import HeaderNavigation from "@/components/gym/templates/headerNavigation"
import { cancelTransaction, checkTransactionStatus } from "@/service/transaction.service"
import { fetchTransactions } from "@/store/slice/transactionSlice"
import { AppDispatch, RootState } from "@/store/store"
import { TransactionsResponse, TransactionStatus } from "@/type/Transaction.type"
import { FormatRupiah } from "@/utils/FormaterHelper"
import { getStatusUI } from "@/utils/transactionHelper"
import { Ionicons } from "@expo/vector-icons"
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router"
import React, { useCallback, useEffect, useRef, useState } from "react"
import { ActivityIndicator, Alert, ScrollView, StatusBar, Text, TouchableOpacity, View } from "react-native"
import { ALERT_TYPE, Toast } from "react-native-alert-notification"
import { SafeAreaView } from "react-native-safe-area-context"
import { useDispatch, useSelector } from "react-redux"

type HeroConfig = {
  icon: React.ComponentProps<typeof Ionicons>["name"]
  title: string
  outer: string
  mid: string
  inner: string
}

const HERO: Record<TransactionStatus, HeroConfig> = {
  SUCCESS: { icon: "checkmark", title: "Pembayaran berhasil!", outer: "bg-primary/5", mid: "bg-primary/20", inner: "bg-primary" },
  PENDING: { icon: "time", title: "Menunggu Pembayaran", outer: "bg-secondary/5", mid: "bg-secondary/20", inner: "bg-secondary" },
  PROCESS: { icon: "sync", title: "Pembayaran Diproses", outer: "bg-info/5", mid: "bg-info/20", inner: "bg-info" },
  CHALLENGE: { icon: "shield-checkmark", title: "Sedang Ditinjau", outer: "bg-warning/5", mid: "bg-warning/20", inner: "bg-warning" },
  FAILURE: { icon: "close", title: "Pembayaran Gagal", outer: "bg-danger/5", mid: "bg-danger/20", inner: "bg-danger" },
  EXPIRED: {
    icon: "hourglass",
    title: "Pembayaran Kedaluwarsa",
    outer: "bg-text-muted/5",
    mid: "bg-text-muted/20",
    inner: "bg-text-muted"
  },
  CANCELLED: { icon: "close", title: "Transaksi Dibatalkan", outer: "bg-text-muted/5", mid: "bg-text-muted/20", inner: "bg-text-muted" }
}

const VARIANTS = {
  secondary: { box: "bg-secondary", text: "text-[#111317]", spinner: "#111317" },
  outline: { box: "border border-border bg-surface", text: "text-text-primary", spinner: "#FFFFFF" },
  danger: { box: "border border-danger/40 bg-danger/10", text: "text-danger", spinner: "#EF4444" }
}

const formatDateTime = (iso: string) =>
  new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  })

const formatCountdown = (totalSeconds: number) => {
  const h = Math.floor(totalSeconds / 3600)
  const m = Math.floor((totalSeconds % 3600) / 60)
  const s = totalSeconds % 60
  return [h, m, s].map((n) => String(n).padStart(2, "0")).join(":")
}

// ================= KOMPONEN KECIL =================
const InfoRow = ({ label, value, valueClassName = "text-text-primary" }: { label: string; value: string; valueClassName?: string }) => (
  <View className="flex-row items-center justify-between">
    <Text className="text-xs text-text-secondary">{label}</Text>
    <Text className={`text-xs font-bold ${valueClassName}`}>{value}</Text>
  </View>
)

const ActionButton = ({
  label,
  variant,
  onPress,
  loading = false,
  disabled = false
}: {
  label: string
  variant: keyof typeof VARIANTS
  onPress: () => void
  loading?: boolean
  disabled?: boolean
}) => {
  const style = VARIANTS[variant]
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      disabled={disabled || loading}
      className={`w-full flex-row items-center justify-center gap-2 rounded-xl py-4 ${style.box} ${disabled ? "opacity-50" : ""}`}
    >
      {loading ? <ActivityIndicator color={style.spinner} /> : null}
      <Text className={`text-sm font-bold ${style.text}`}>{label}</Text>
    </TouchableOpacity>
  )
}

// ================= SCREEN =================
export default function TransactionDetail() {
  const router = useRouter()
  const { id } = useLocalSearchParams<{ id: string }>()
  const dispatch = useDispatch<AppDispatch>()
  const { result } = useSelector((state: RootState) => state.transaction)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [checking, setChecking] = useState(false)
  const [cancelling, setCancelling] = useState(false)
  const [now, setNow] = useState(() => Date.now())
  const expiryChecked = useRef(false)

  useEffect(() => {
    void dispatch(fetchTransactions())
  }, [])

  const data = result?.data.find((item) => item.id === id)
  const isPending = data?.status === "PENDING"

  const load = useCallback(async () => {
    try {
      const payload = await dispatch(fetchTransactions()).unwrap()
      setError(null)
      return payload.data.find((t: TransactionsResponse) => t.id === id) ?? null
    } catch (e: any) {
      setError(e.message || "Gagal memuat transaksi.")
      return null
    } finally {
      setLoading(false)
    }
  }, [dispatch, id])

  useFocusEffect(
    useCallback(() => {
      void load()
    }, [load])
  )

  useEffect(() => {
    if (!isPending) return
    setNow(Date.now())
    const timer = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(timer)
  }, [isPending])

  const remaining = data?.expiredAt ? Math.max(0, Math.floor((new Date(data.expiredAt).getTime() - now) / 1000)) : 0
  const isTimeUp = isPending && !!data?.expiredAt && remaining === 0

  useEffect(() => {
    if (isTimeUp && !expiryChecked.current) {
      expiryChecked.current = true
      void handleCheckStatus(true)
    }
  }, [isTimeUp])

  const handleCheckStatus = async (silent = false) => {
    if (!silent) setChecking(true)
    let message: string | null = null
    try {
      await checkTransactionStatus(data?.orderId!)
    } catch (e: any) {
      message = e.response?.data?.message || "Gagal memeriksa status. Coba lagi."
    }

    const fresh = await load()

    if (!silent) {
      setChecking(false)
      if (fresh?.status === "SUCCESS") {
        Toast.show({ type: ALERT_TYPE.SUCCESS, title: "Berhasil", textBody: "Pembayaran sudah diterima.", autoClose: 3000 })
      } else if (message) {
        Toast.show({ type: ALERT_TYPE.WARNING, title: "Status Transaksi", textBody: message, autoClose: 3000 })
      } else if (fresh?.status === "PENDING") {
        Toast.show({ type: ALERT_TYPE.WARNING, title: "Belum Ada Pembayaran", textBody: "Pembayaran belum diterima.", autoClose: 3000 })
      }
    }
  }

  const handlePay = () => {
    if (!data?.paymentUrl) {
      Toast.show({ type: ALERT_TYPE.DANGER, title: "Gagal", textBody: "Tautan pembayaran tidak tersedia.", autoClose: 3000 })
      return
    }
    router.push({
      pathname: "/(gym)/dashboard/paymentScreen",
      params: {
        paymentUrl: data.paymentUrl,
        type: data.type === "PT_BOOKING" ? "pt-booking" : "membership"
      }
    })
  }

  const handleCancel = () => {
    Alert.alert("Batalkan transaksi?", "Transaksi yang dibatalkan tidak bisa dibayar lagi.", [
      { text: "Tidak", style: "cancel" },
      {
        text: "Ya, batalkan",
        style: "destructive",
        onPress: async () => {
          try {
            setCancelling(true)
            console.log(data?.orderId)
            await cancelTransaction(data?.orderId!)
            Toast.show({ type: ALERT_TYPE.SUCCESS, title: "Berhasil", textBody: "Transaksi dibatalkan.", autoClose: 3000 })
            await load()
          } catch (e: any) {
            const message = e.response?.data?.message || "Gagal membatalkan transaksi. Coba lagi."
            Toast.show({ type: ALERT_TYPE.DANGER, title: "Gagal", textBody: message, autoClose: 3000 })
          } finally {
            setCancelling(false)
          }
        }
      }
    ])
  }

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-background">
        <StatusBar barStyle="light-content" />
        <HeaderNavigation label="Detail Transaksi" />
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color="#FF6B00" />
        </View>
      </SafeAreaView>
    )
  }

  if (!data) {
    return (
      <SafeAreaView className="flex-1 bg-background">
        <StatusBar barStyle="light-content" />
        <HeaderNavigation label="Detail Transaksi" />
        <View className="flex-1 items-center justify-center gap-4 px-8">
          <Text className="text-center text-sm text-text-secondary">{error ?? "Transaksi tidak ditemukan."}</Text>
          <ActionButton
            label="Coba lagi"
            variant="outline"
            onPress={() => {
              setLoading(true)
              load()
            }}
          />
        </View>
      </SafeAreaView>
    )
  }

  // ---------- Turunan tampilan ----------
  const hero = HERO[data.status]
  const statusUI = getStatusUI(data.status)
  const isSuccess = data.status === "SUCCESS"
  const typeLabel = data.type === "PT_BOOKING" ? "Booking Trainer" : "Membership"
  const canContinue = isPending && !isTimeUp
  const canCheck = isPending || data.status === "PROCESS" || data.status === "CHALLENGE"

  return (
    <SafeAreaView className="flex-1 bg-background">
      <StatusBar barStyle="light-content" />

      {/* HEADER */}
      <HeaderNavigation label="Detail Transaksi" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="px-5 pt-8 pb-10 gap-4 items-center"
      >
        {/* HERO */}
        <View className="w-full items-center justify-center">
          <View className={`mb-2 h-32 w-32 items-center justify-center rounded-full ${hero.outer}`}>
            <View className={`h-24 w-24 items-center justify-center rounded-full ${hero.mid}`}>
              <View className={`h-16 w-16 items-center justify-center rounded-full border-[3px] border-surface ${hero.inner}`}>
                <Ionicons
                  name={hero.icon}
                  size={32}
                  color="#1A1D24"
                />
              </View>
            </View>
          </View>

          <Text className="text-center text-3xl font-extrabold text-white">{hero.title}</Text>
        </View>

        {/* HITUNG MUNDUR (hanya PENDING) */}
        {isPending && data.expiredAt ? (
          <View className="w-full items-center rounded-2xl border border-secondary/30 bg-secondary/10 p-4">
            {isTimeUp ? (
              <>
                <Text className="text-sm font-bold text-secondary">Waktu pembayaran habis</Text>
                <Text className="mt-1 text-center text-[11px] text-text-secondary">Memeriksa status terbaru transaksi kamu…</Text>
              </>
            ) : (
              <>
                <Text className="text-[10px] font-bold uppercase tracking-widest text-text-secondary">Selesaikan pembayaran dalam</Text>
                <Text className="mt-1 text-3xl font-extrabold text-secondary">{formatCountdown(remaining)}</Text>
                <Text className="mt-1 text-[11px] text-text-secondary">Batas waktu: {formatDateTime(data.expiredAt)}</Text>
              </>
            )}
          </View>
        ) : null}

        {/* RINGKASAN */}
        <View className="w-full rounded-2xl border border-border/50 bg-card p-5">
          <Text className={`mb-3 text-[10px] font-bold uppercase tracking-widest ${statusUI.textColor}`}>
            {typeLabel} • {statusUI.label}
          </Text>
          <Text className="mb-4 text-2xl font-bold text-text-primary">{data.name}</Text>
          <Text className="text-3xl font-extrabold text-primary">{FormatRupiah(data.amount)}</Text>
        </View>

        {/* INFORMASI TRANSAKSI */}
        <View className="w-full rounded-2xl border border-border/50 bg-card p-5">
          <Text className="mb-4 text-sm font-bold text-text-primary">Informasi transaksi</Text>

          <View className="gap-3">
            <InfoRow
              label="ID transaksi"
              value={data.orderId}
            />
            <InfoRow
              label="Tanggal transaksi"
              value={formatDateTime(data.createdAt)}
            />
            {data.paidAt ? (
              <InfoRow
                label="Tanggal dibayar"
                value={formatDateTime(data.paidAt)}
              />
            ) : null}
            <InfoRow
              label="Metode pembayaran"
              value={data.paymentType ? String(data.paymentType) : "-"}
            />
            <InfoRow
              label="Status"
              value={statusUI.label}
              valueClassName={statusUI.textColor}
            />
          </View>
        </View>

        {/* RINCIAN PEMBAYARAN */}
        <View className="w-full rounded-2xl border border-border/50 bg-card p-5">
          <Text className="mb-4 text-sm font-bold text-text-primary">Rincian pembayaran</Text>

          <View className="gap-2">
            <View className="flex-row items-center justify-between">
              <Text className="text-xs text-text-secondary">Harga paket</Text>
              <Text className="text-xs font-bold text-text-primary">{FormatRupiah(data.amount)}</Text>
            </View>
            <View className="mt-2 flex-row items-center justify-between border-t border-border/30 pt-3">
              <Text className="text-sm font-bold text-text-primary">Total pembayaran</Text>
              <Text className="text-sm font-bold text-text-primary">{FormatRupiah(data.amount)}</Text>
            </View>
          </View>
        </View>

        {/* INFO TAMBAHAN PER STATUS */}
        {isSuccess ? (
          <View className="w-full rounded-2xl border border-success/20 bg-[#1A2E22] p-4">
            <Text className="mb-1 text-sm font-bold text-success">Pembayaran tercatat</Text>
            <Text className="text-xs leading-5 text-[#74C69D]">
              Gunakan Digital Pass dari menu Pass. Jangan gunakan bukti transaksi sebagai QR masuk.
            </Text>
          </View>
        ) : null}

        {data.status === "PROCESS" || data.status === "CHALLENGE" ? (
          <View className="w-full rounded-2xl border border-border/50 bg-surface p-4">
            <Text className="text-xs leading-5 text-text-secondary">
              {data.status === "PROCESS"
                ? "Pembayaranmu sedang diproses. Tekan Cek Status untuk melihat perkembangan terbaru."
                : "Transaksi sedang ditinjau oleh penyedia pembayaran. Tekan Cek Status untuk melihat hasilnya."}
            </Text>
          </View>
        ) : null}

        {/* TOMBOL AKSI */}
        <View className="w-full gap-3">
          {isSuccess ? (
            <TouchableOpacity
              className="w-full items-center justify-center rounded-xl bg-primary py-4"
              // onPress={() => router.push("/(gym)/navigation/pass")} // TODO: arahkan ke halaman Digital Pass
            >
              <Text className="text-sm font-bold text-[#111317]">Lihat Digital Pass</Text>
            </TouchableOpacity>
          ) : null}

          {canContinue ? (
            <ActionButton
              label="Lanjutkan Pembayaran"
              variant="secondary"
              onPress={handlePay}
              disabled={cancelling}
            />
          ) : null}

          {canCheck ? (
            <ActionButton
              label="Cek Status"
              variant="outline"
              onPress={() => handleCheckStatus()}
              loading={checking}
              disabled={cancelling}
            />
          ) : null}

          {isPending ? (
            <ActionButton
              label="Batalkan Transaksi"
              variant="danger"
              onPress={handleCancel}
              loading={cancelling}
              disabled={checking}
            />
          ) : (
            <ActionButton
              label="Kembali ke riwayat transaksi"
              variant="outline"
              onPress={() => router.back()}
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
