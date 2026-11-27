import PaymentSection from "@/components/gym/payment/paymentSection"
import HeaderNavigation from "@/components/gym/templates/headerNavigation"
import { bookingTrainer } from "@/service/trainer.service"
import { fetchTrainers } from "@/store/slice/trainerSlice"
import { AppDispatch, RootState } from "@/store/store"
import { BankId, PaymentMethodId } from "@/type/payment.type"
import { formatRange } from "@/utils/FormaterHelper"
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"
import { useLocalSearchParams, useRouter } from "expo-router"
import React, { useEffect, useState } from "react"
import { Image, ScrollView, StatusBar, Text, TouchableOpacity, View } from "react-native"
import { ALERT_TYPE, Toast } from "react-native-alert-notification"
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
  if (h === 0) return `${m} minutes`
  return m === 0 ? `${h} hours` : `${h} hours ${m} minutes`
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
    ? new Date(date).toLocaleDateString("en-US", { weekday: "long", day: "numeric", month: "long", year: "numeric" })
    : "-"
  const timeText = startTime && endTime ? formatRange(startTime, endTime) : "-"
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
      const { redirectUrl, orderId } = data
      router.replace({
        pathname: "/(gym)/dashboard/paymentScreen",
        params: { paymentUrl: redirectUrl, type: "pt-booking", orderId }
      })
    } catch (error: any) {
      let errorMessage = "An unknown error occurred"
      let errorTitle = "Payment Failed"

      if (error.request && !error.response) {
        errorTitle = "Connection Problem"
        errorMessage = "Unable to connect to the server. Check your internet connection and make sure the server is available."
      } else if (error.response) {
        errorMessage = error.response.data?.message || "A server error occurred"
      } else if (error.message) {
        errorMessage = error.message
      }

      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: errorTitle,
        textBody: errorMessage,
        autoClose: 3000
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleReschedule = () => {
    router.back()
  }

  return (
    <SafeAreaView className="flex-1 bg-background font-inter">
      <StatusBar barStyle="light-content" />

      {/* HEADER */}
      <HeaderNavigation label="Booking Confirmation" />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="px-5 pb-44 pt-4 font-inter">
          {/* TRAINER CARD */}
          <View className="mb-6 flex-row items-center gap-3 rounded-2xl border border-border bg-surface p-3 font-inter">
            {hasPhoto ? (
              <Image
                source={{ uri: trainer?.profileUrl }}
                onError={() => setImageFailed(true)}
                className="h-16 w-16 rounded-xl bg-card font-inter"
                resizeMode="cover"
              />
            ) : (
              <View className="h-16 w-16 overflow-hidden rounded-xl border border-primary/20 font-inter">
                <LinearGradient
                  colors={["#5A3320", "#242833"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
                >
                  <Text className="font-inter text-xl font-extrabold text-accent">{trainer ? getInitials(trainer.name) : "-"}</Text>
                </LinearGradient>
              </View>
            )}

            <View className="flex-1 gap-1.5 font-inter">
              <Text
                className="font-inter text-base font-bold text-text-primary"
                numberOfLines={1}
              >
                {trainer?.name ?? "Loading trainer data..."}
              </Text>

              {trainer ? (
                <>
                  <View className="flex-row items-center gap-1.5 self-start rounded-full border border-primary/40 bg-primary/10 px-2.5 py-1 font-inter">
                    <View className="h-1.5 w-1.5 rounded-full bg-primary" />
                    <Text className="font-inter text-[10px] font-bold uppercase tracking-wide text-primary-hover">
                      {formatLabel(trainer.specialization)}
                    </Text>
                  </View>

                  <View className="flex-row items-center gap-1 font-inter">
                    <Ionicons
                      name="time-outline"
                      size={12}
                      color="#B8BDC7"
                    />
                    <Text className="font-inter text-[11px] text-text-secondary">{trainer.experience} years of experience</Text>
                  </View>
                </>
              ) : null}
            </View>
          </View>

          {/* RINGKASAN SESI */}
          <View className="mb-6 rounded-2xl border border-border bg-card p-4 font-inter">
            <View className="mb-4 flex-row items-center justify-between font-inter">
              <View className="flex-row items-center gap-2 font-inter">
                <Ionicons
                  name="calendar-clear-outline"
                  size={18}
                  color="#FF6B00"
                />
                <Text className="font-inter text-sm font-bold text-text-primary">Session Summary</Text>
              </View>
              <View className="flex-row items-center gap-1 rounded-md bg-secondary/15 px-2 py-1 font-inter">
                <View className="h-1.5 w-1.5 rounded-full bg-secondary" />
                <Text className="font-inter text-[10px] font-bold text-secondary">Unpaid</Text>
              </View>
            </View>

            <View className="gap-4 font-inter">
              {/* Tanggal */}
              <View className="flex-row gap-3 font-inter">
                <View className="h-9 w-9 items-center justify-center rounded-full bg-primary/10 font-inter">
                  <Ionicons
                    name="calendar-outline"
                    size={16}
                    color="#FFB693"
                  />
                </View>
                <View className="flex-1 font-inter">
                  <Text className="mb-0.5 font-inter text-[10px] font-bold uppercase tracking-wide text-text-subdued">Date</Text>
                  <Text className="font-inter text-sm font-semibold text-text-primary">{dateText}</Text>
                </View>
              </View>

              {/* Waktu */}
              <View className="flex-row gap-3 font-inter">
                <View className="h-9 w-9 items-center justify-center rounded-full bg-info/10 font-inter">
                  <Ionicons
                    name="time-outline"
                    size={16}
                    color="#60A5FA"
                  />
                </View>
                <View className="flex-1 font-inter">
                  <Text className="mb-0.5 font-inter text-[10px] font-bold uppercase tracking-wide text-text-subdued">Time & Duration</Text>
                  <Text className="font-inter text-sm font-semibold text-text-primary">{timeText}</Text>
                  <Text className="font-inter text-[11px] text-text-secondary">WIB (UTC+7) • {durationText}</Text>
                </View>
              </View>

              {/* Catatan sesi */}
              {description ? (
                <View className="flex-row gap-3 font-inter">
                  <View className="h-9 w-9 items-center justify-center rounded-full bg-secondary/10 font-inter">
                    <MaterialCommunityIcons
                      name="text-box-outline"
                      size={16}
                      color="#FFD166"
                    />
                  </View>
                  <View className="flex-1 font-inter">
                    <Text className="mb-0.5 font-inter text-[10px] font-bold uppercase tracking-wide text-text-subdued">Session Notes</Text>
                    <Text className="font-inter text-sm text-text-body">{description}</Text>
                  </View>
                </View>
              ) : null}

              <View className="h-px bg-border font-inter" />

              {/* Biaya */}
              <View className="flex-row items-center justify-between font-inter">
                <Text className="font-inter text-sm text-text-secondary">Price per session</Text>
                <Text className="font-inter text-base font-bold text-accent">{priceText}</Text>
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
            label="Training Duration"
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
            className="mb-4 mt-4 flex-row items-start gap-3 font-inter"
            onPress={() => setIsChecked(!isChecked)}
            activeOpacity={0.7}
          >
            <View
              className={`mt-0.5 h-5 w-5 items-center justify-center rounded font-inter ${isChecked ? "bg-primary" : "border border-border bg-surface"}`}
            >
              {isChecked && (
                <Ionicons
                  name="checkmark"
                  size={14}
                  color="white"
                />
              )}
            </View>
            <View className="mt-0.5 flex-1 font-inter">
              <Text className="mb-1 font-inter text-lg font-bold text-text-primary">I agree to the Booking Terms</Text>
              <Text className="text-justify font-inter text-sm text-text-secondary">
                Please double-check your selected time slot before confirming.
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* BOTTOM ACTION BUTTONS */}
      <View className="absolute bottom-0 left-0 right-0 border-t border-border/40 bg-background px-5 py-4 pb-8 font-inter">
        <TouchableOpacity
          className={`mb-3 w-full flex-row items-center justify-center gap-2 rounded-xl py-3.5 font-inter ${canSubmit ? "bg-primary" : "bg-primary/50"}`}
          onPress={handleConfirm}
          disabled={!canSubmit}
        >
          <Ionicons
            name="checkmark-circle-outline"
            size={20}
            color="white"
          />
          <Text className="font-inter text-sm font-bold text-white">{submitting ? "Processing..." : "Confirm Booking"}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleReschedule}
          className="w-full flex-row items-center justify-center gap-2 rounded-xl border border-border bg-surface py-3.5 font-inter"
        >
          <MaterialCommunityIcons
            name="calendar-refresh"
            size={18}
            color="#B8BDC7"
          />
          <Text className="font-inter text-sm font-semibold text-text-primary">Choose Another Time Slot</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}
