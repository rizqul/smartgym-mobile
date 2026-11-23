import PaymentSection from "@/components/gym/payment/paymentSection"
import HeaderNavigation from "@/components/gym/templates/headerNavigation"
import { bookingTrainer } from "@/service/trainer.service"
import { fetchTrainers } from "@/store/slice/trainerSlice"
import { AppDispatch, RootState } from "@/store/store"
import { BankId, PaymentMethodId } from "@/type/payment.type"
import { getTimezoneLabel } from "@/utils/timeZoneHelper"
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"
import { useLocalSearchParams, useRouter } from "expo-router"
import React, { useEffect, useState } from "react"
import { Image, ScrollView, StatusBar, Text, TouchableOpacity, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useDispatch, useSelector } from "react-redux"

const formatLabel = (value: string) =>
  value
    .replace(/[_-]+/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase())

const formatRupiah = (value: number) => `Rp ${String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`

const getInitials = (name: string) =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase()

const formatDuration = (start: string, end: string) => {
  const minutes = Math.round((new Date(end).getTime() - new Date(start).getTime()) / 60000)
  if (!Number.isFinite(minutes) || minutes <= 0) return "-"
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  if (h === 0) return `${m} menit`
  return m === 0 ? `${h} jam` : `${h} jam ${m} menit`
}

const GENERATED_AVATAR = /ui-avatars|dicebear|initials|avatar\.iran|gravatar/i

export default function BookingConfirm() {
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()
  const { trainerId, slotId, date, startTime, endTime, description } = useLocalSearchParams<{
    trainerId: string
    slotId: string
    date: string
    startTime: string
    endTime: string
    description?: string
  }>()

  const { result } = useSelector((state: RootState) => state.trainer)
  const trainer = result?.find((item) => item.id === trainerId)

  const [isChecked, setIsChecked] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [imageFailed, setImageFailed] = useState(false)
  const [paymentId, setPaymentId] = useState<PaymentMethodId | "">("OTHER_QRIS")
  const [bankId, setBankId] = useState<BankId | "">("")

  useEffect(() => {
    if (!result?.length) {
      dispatch(fetchTrainers())
    }
  }, [])

  const dateText = date
    ? new Date(date).toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })
    : "-"
  const timeText = startTime && endTime ? `${startTime.substring(11, 16)} - ${endTime.substring(11, 16)}` : "-"
  const durationText = startTime && endTime ? formatDuration(startTime, endTime) : "-"
  const priceText = trainer ? formatRupiah(trainer.rate) : "-"

  const hasPhoto = !!trainer?.profileUrl && !imageFailed && !GENERATED_AVATAR.test(trainer.profileUrl)

  const needBank = paymentId === "bank" && bankId === ""
  const canSubmit = isChecked && !!trainer && !needBank && !submitting

  const handleConfirm = async () => {
    if (!canSubmit) return
    try {
      setSubmitting(true)
      const paymentType = paymentId !== "" ? paymentId : bankId
      const data = await bookingTrainer(slotId, paymentType)
      const { redirectUrl } = data
      router.push({
        pathname: "/(gym)/dashboard/paymentScreen",
        params: { paymentUrl: redirectUrl, type: "pt-booking" }
      })
    } catch (err: any) {
      console.log(err.response?.status, err.response?.data)
    } finally {
      setSubmitting(false)
    }
  }

  const handleReschedule = () => {
    router.back()
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <StatusBar barStyle="light-content" />

      {/* HEADER */}
      <HeaderNavigation label="Konfirmasi Pemesanan" />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="px-5 pb-44 pt-4">
          {/* TRAINER CARD */}
          <View className="mb-6 flex-row items-center gap-3 rounded-2xl border border-border bg-surface p-3">
            {hasPhoto ? (
              <Image
                source={{ uri: trainer?.profileUrl }}
                onError={() => setImageFailed(true)}
                className="h-16 w-16 rounded-xl bg-card"
                resizeMode="cover"
              />
            ) : (
              <View className="h-16 w-16 overflow-hidden rounded-xl border border-primary/20">
                <LinearGradient
                  colors={["#5A3320", "#242833"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
                >
                  <Text className="text-xl font-extrabold text-accent">{trainer ? getInitials(trainer.name) : "-"}</Text>
                </LinearGradient>
              </View>
            )}

            <View className="flex-1 gap-1.5">
              <Text
                className="text-base font-bold text-text-primary"
                numberOfLines={1}
              >
                {trainer?.name ?? "Memuat data trainer..."}
              </Text>

              {trainer ? (
                <>
                  <View className="flex-row items-center gap-1.5 self-start rounded-full border border-primary/40 bg-primary/10 px-2.5 py-1">
                    <View className="h-1.5 w-1.5 rounded-full bg-primary" />
                    <Text className="text-[10px] font-bold uppercase tracking-wide text-primary-hover">
                      {formatLabel(trainer.specialization)}
                    </Text>
                  </View>

                  <View className="flex-row items-center gap-1">
                    <Ionicons
                      name="time-outline"
                      size={12}
                      color="#B8BDC7"
                    />
                    <Text className="text-[11px] text-text-secondary">{trainer.experience} tahun pengalaman</Text>
                  </View>
                </>
              ) : null}
            </View>
          </View>

          {/* RINGKASAN SESI */}
          <View className="mb-6 rounded-2xl border border-border bg-card p-4">
            <View className="mb-4 flex-row items-center justify-between">
              <View className="flex-row items-center gap-2">
                <Ionicons
                  name="calendar-clear-outline"
                  size={18}
                  color="#FF6B00"
                />
                <Text className="text-sm font-bold text-text-primary">Ringkasan Sesi</Text>
              </View>
              <View className="flex-row items-center gap-1 rounded-md bg-secondary/15 px-2 py-1">
                <View className="h-1.5 w-1.5 rounded-full bg-secondary" />
                <Text className="text-[10px] font-bold text-secondary">Belum Dibayar</Text>
              </View>
            </View>

            <View className="gap-4">
              {/* Tanggal */}
              <View className="flex-row gap-3">
                <View className="h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                  <Ionicons
                    name="calendar-outline"
                    size={16}
                    color="#FFB693"
                  />
                </View>
                <View className="flex-1">
                  <Text className="mb-0.5 text-[10px] font-bold uppercase tracking-wide text-text-subdued">Tanggal</Text>
                  <Text className="text-sm font-semibold text-text-primary">{dateText}</Text>
                </View>
              </View>

              {/* Waktu */}
              <View className="flex-row gap-3">
                <View className="h-9 w-9 items-center justify-center rounded-full bg-info/10">
                  <Ionicons
                    name="time-outline"
                    size={16}
                    color="#60A5FA"
                  />
                </View>
                <View className="flex-1">
                  <Text className="mb-0.5 text-[10px] font-bold uppercase tracking-wide text-text-subdued">Waktu & Durasi</Text>
                  <Text className="text-sm font-semibold text-text-primary">{timeText}</Text>
                  <Text className="text-[11px] text-text-secondary">
                    {getTimezoneLabel()} • {durationText}
                  </Text>
                </View>
              </View>

              {/* Catatan sesi */}
              {description ? (
                <View className="flex-row gap-3">
                  <View className="h-9 w-9 items-center justify-center rounded-full bg-secondary/10">
                    <MaterialCommunityIcons
                      name="text-box-outline"
                      size={16}
                      color="#FFD166"
                    />
                  </View>
                  <View className="flex-1">
                    <Text className="mb-0.5 text-[10px] font-bold uppercase tracking-wide text-text-subdued">Catatan Sesi</Text>
                    <Text className="text-sm text-text-body">{description}</Text>
                  </View>
                </View>
              ) : null}

              <View className="h-px bg-border" />

              {/* Biaya */}
              <View className="flex-row items-center justify-between">
                <Text className="text-sm text-text-secondary">Tarif per sesi</Text>
                <Text className="text-base font-bold text-accent">{priceText}</Text>
              </View>
            </View>
          </View>

          <PaymentSection
            summary={{
              planName: trainer ? `Sesi PT • ${trainer.name}` : "Sesi PT",
              price: priceText,
              duration: durationText,
              total: priceText
            }}
            label="Durasi Latihan"
            onSelectMethod={(id) => {
              setPaymentId(id)
              setBankId("")
            }}
            onSelectBank={(id) => {
              setBankId(id)
              setPaymentId("")
            }}
          />

          {/* CHECKBOX KETENTUAN */}
          <TouchableOpacity
            className="mb-4 mt-4 flex-row items-start gap-3"
            onPress={() => setIsChecked(!isChecked)}
            activeOpacity={0.7}
          >
            <View
              className={`mt-0.5 h-5 w-5 items-center justify-center rounded ${isChecked ? "bg-primary" : "border border-border bg-surface"}`}
            >
              {isChecked && (
                <Ionicons
                  name="checkmark"
                  size={14}
                  color="white"
                />
              )}
            </View>
            <View className="flex-1">
              <Text className="mb-1 text-xs font-bold text-text-primary">Saya menyetujui Kebijakan Booking & Pembatalan</Text>
              <Text className="text-[10px] leading-4 text-text-secondary">
                Pembatalan atau reschedule gratis maksimal 4 jam sebelum sesi dimulai. Turnstile gate akan memberikan akses otomatis 30
                menit sebelum jadwal sesi.
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* BOTTOM ACTION BUTTONS */}
      <View className="absolute bottom-0 left-0 right-0 border-t border-border/40 bg-background px-5 py-4 pb-8">
        <TouchableOpacity
          className={`mb-3 w-full flex-row items-center justify-center gap-2 rounded-xl py-3.5 ${canSubmit ? "bg-primary" : "bg-primary/50"}`}
          onPress={handleConfirm}
          disabled={!canSubmit}
        >
          <Ionicons
            name="checkmark-circle-outline"
            size={20}
            color="white"
          />
          <Text className="text-sm font-bold text-white">{submitting ? "Memproses..." : "Konfirmasi Pemesanan"}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleReschedule}
          className="w-full flex-row items-center justify-center gap-2 rounded-xl border border-border bg-surface py-3.5"
        >
          <MaterialCommunityIcons
            name="calendar-refresh"
            size={18}
            color="#B8BDC7"
          />
          <Text className="text-sm font-semibold text-text-primary">Pilih Ulang Slot Waktu</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}
