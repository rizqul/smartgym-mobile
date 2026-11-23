import { getTrainerSlot } from "@/service/trainer.service"
import { fetchTrainers } from "@/store/slice/trainerSlice"
import { AppDispatch, RootState } from "@/store/store"
import { Trainer, TrainerSlot } from "@/type/Trainer.type"
import { generateUpcomingDates } from "@/utils/dateHelper"
import { getTimezoneLabel } from "@/utils/timeZoneHelper"
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"
import { useLocalSearchParams, useRouter } from "expo-router"
import React, { useEffect, useMemo, useState } from "react"
import { Image, ScrollView, StatusBar, Text, TouchableOpacity, View } from "react-native"
import { ALERT_TYPE, Toast } from "react-native-alert-notification"
import { SafeAreaView } from "react-native-safe-area-context"
import { useDispatch, useSelector } from "react-redux"

export default function TrainerProfile() {
  const { id }: { id: string } = useLocalSearchParams()
  const router = useRouter()
  const [timeSlots, setTimeSlots] = useState<TrainerSlot[]>([])
  const [selectedTime, setSelectedTime] = useState<TrainerSlot | null>(null)
  const dates = useMemo(() => generateUpcomingDates(14), [])
  const [selectedDate, setSelectedDate] = useState<string>(dates[0].fullDate)
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch<AppDispatch>()
  const { result } = useSelector((state: RootState) => state.trainer)
  const data = result?.find((item: Trainer) => item.id === id)

  const fetchSlots = async (ignore: boolean) => {
    try {
      setLoading(true)
      setSelectedTime(null)
      const response = await getTrainerSlot(id, selectedDate)
      if (!ignore) setTimeSlots(response.data)
    } catch (error) {
      console.log("Error : ", error)
      if (!ignore) setTimeSlots([])
    } finally {
      if (!ignore) setLoading(false)
    }
  }

  useEffect(() => {
    if (!result?.length) {
      dispatch(fetchTrainers())
    }
  }, [])

  useEffect(() => {
    let ignore = false
    void fetchSlots(ignore)

    return () => {
      ignore = true
    }
  }, [id, selectedDate])

  const dateText = new Date(selectedDate).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric"
  })

  const availableCount = timeSlots.filter((s) => s.status === "AVAILABLE").length

  const onNext = () => {
    if (!selectedTime?.id) {
      Toast.show({
        type: ALERT_TYPE.WARNING,
        title: "Pilih Slot",
        textBody: "Silakan pilih slot jadwal terlebih dahulu sebelum melanjutkan.",
        autoClose: 3000
      })
      return
    }
    router.push({
      pathname: "/trainer/booking-confirm",
      params: {
        trainerId: id,
        slotId: String(selectedTime.id),
        date: selectedDate,
        startTime: selectedTime.startTime,
        endTime: selectedTime.endTime,
        description: selectedTime.description ?? ""
      }
    })
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <StatusBar barStyle="light-content" />

      <View className="flex-row items-center justify-between px-5 py-4">
        <View className="flex-row items-center gap-4">
          <TouchableOpacity
            onPress={() => router.back()}
            className="h-10 w-10 justify-center"
          >
            <Ionicons
              name="arrow-back"
              size={24}
              color="white"
            />
          </TouchableOpacity>
          <Text className="font-inter text-lg font-bold text-text-primary">Jadwal Trainer</Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="pb-32"
      >
        {/* ================= HERO SECTION ================= */}
        <View className="mb-6 px-5">
          <View className="overflow-hidden rounded-3xl border border-border bg-surface">
            {/* Foto */}
            <View className="h-[240px] w-full bg-border/30">
              <Image
                source={{
                  uri: data?.profileUrl ?? "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=600&auto=format&fit=crop"
                }}
                className="h-full w-full"
                resizeMode="cover"
              />

              {/* Fade tipis di bawah foto agar menyatu dengan kartu */}
              <LinearGradient
                colors={["transparent", "#1A1D24"]}
                pointerEvents="none"
                style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 80 }}
              />

              {/* Badge */}
              <View className="absolute left-4 top-4 flex-row items-center gap-1.5 rounded-full border border-success/40 bg-background/80 px-3 py-1.5">
                <View className="h-1.5 w-1.5 rounded-full bg-success" />
                <Text className="text-[10px] font-bold text-text-primary">Siap Booking</Text>
              </View>
            </View>

            {/* Info trainer */}
            <View className="gap-3 px-5 pb-5 pt-2">
              <Text className="text-2xl font-bold text-text-primary">Coach {data?.name}</Text>

              <View className="flex-row items-center gap-1.5 self-start rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5">
                <MaterialCommunityIcons
                  name="arm-flex"
                  size={14}
                  color="#FF8A33"
                />
                <Text className="text-xs font-semibold text-primary-hover">{data?.specialization}</Text>
              </View>

              <Text className="text-sm leading-5 text-text-secondary">
                Spesialis program Hyperthrophy, Biomechanics Form Correction, dan peningkatan kekuatan fungsional tanpa risiko cedera.
              </Text>

              <View className="h-px bg-border" />

              {/* Statistik */}
              <View className="flex-row">
                <View className="flex-1 flex-row items-center gap-3">
                  <View className="h-10 w-10 items-center justify-center rounded-full bg-success/15">
                    <Ionicons
                      name="calendar"
                      size={18}
                      color="#22C55E"
                    />
                  </View>
                  <View>
                    <Text className="text-base font-bold text-text-primary">{loading ? "-" : availableCount}</Text>
                    <Text className="text-[10px] text-text-secondary">Slot Tersedia</Text>
                  </View>
                </View>

                <View className="my-1 w-px bg-border" />

                <View className="flex-1 flex-row items-center gap-3 pl-4">
                  <View className="h-10 w-10 items-center justify-center rounded-full bg-info/15">
                    <Ionicons
                      name="time"
                      size={18}
                      color="#60A5FA"
                    />
                  </View>
                  <View>
                    <Text className="text-base font-bold text-text-primary">{data?.experience} Thn</Text>
                    <Text className="text-[10px] text-text-secondary">Pengalaman</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* ================= SCHEDULE SECTION ================= */}
        <View className="px-5">
          <View className="mb-4 flex-row items-end justify-between">
            <View>
              <Text className="mb-1 text-xl font-bold text-text-primary">Available Schedule</Text>
              <Text className="text-xs text-text-secondary">Pilih tanggal sesi latihan minggu ini</Text>
            </View>
            <Text className="text-[10px] font-bold tracking-widest text-primary">MEI - JUN 2024</Text>
          </View>

          {/* Date Picker */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerClassName="gap-2 mb-6"
          >
            {dates.map((item) => {
              const isActive = item.fullDate === selectedDate

              return (
                <TouchableOpacity
                  key={item.fullDate}
                  disabled={item.disabled}
                  onPress={() => setSelectedDate(item.fullDate)}
                  className={`h-20 w-14 items-center justify-center rounded-2xl border ${
                    isActive
                      ? "border-primary bg-primary"
                      : item.disabled
                        ? "border-border/30 bg-card/50 opacity-50"
                        : "border-border bg-card"
                  }`}
                >
                  <Text className={`mb-1 text-[10px] ${isActive ? "text-white" : "text-text-secondary"}`}>{item.day}</Text>
                  <Text className={`text-xl font-bold ${isActive ? "text-white" : "text-text-primary"}`}>{item.date}</Text>
                  {/* Dot Indicator */}
                  <View
                    className={`mt-1 h-1.5 w-1.5 rounded-full ${isActive ? "bg-white" : item.hasDot ? "bg-success" : "bg-transparent"}`}
                  />
                </TouchableOpacity>
              )
            })}
          </ScrollView>

          {/* Info Text */}
          <View className="mb-6 flex-row items-center gap-2">
            <Ionicons
              name="information-circle-outline"
              size={16}
              color="#FF6B00"
            />
            <Text className="text-[11px] text-text-secondary">Hari aktif di-highlight oranye/hijau, trainer libur di-nonaktifkan.</Text>
          </View>

          <View className="mb-3 flex-row items-center justify-between">
            <Text className="text-base font-bold text-text-primary">Slot Latihan ({dateText})</Text>
            <Text className="text-[10px] font-bold text-text-secondary">{getTimezoneLabel()}</Text>
          </View>

          {/* Time Slots List */}
          <View className="gap-3">
            {timeSlots.map((slot) => {
              const time = `${slot.startTime.substring(11, 16)} - ${slot.endTime.substring(11, 16)}`
              return (
                <TouchableOpacity
                  key={slot.id}
                  onPress={() => setSelectedTime(slot)}
                  className={`flex-row items-center rounded-2xl border p-4 
                  ${selectedTime?.id === slot.id && slot.status === "AVAILABLE" ? "border-primary bg-surface" : "border-border bg-card"}`}
                >
                  {/* Icon */}
                  <View
                    className={`mr-3 h-10 w-10 items-center justify-center rounded-full ${
                      selectedTime?.id === slot.id && slot.status === "AVAILABLE" ? "bg-primary" : "bg-background"
                    }`}
                  >
                    <Ionicons
                      name="time-outline"
                      size={20}
                      color={selectedTime?.id === slot.id ? "white" : "#B8BDC7"}
                    />
                  </View>

                  {/* Time & Title */}
                  <View className="flex-1">
                    <Text className={`mb-0.5 text-sm font-bold text-text-primary`}>{time}</Text>
                    {slot.description ? <Text className="text-[11px] text-text-secondary">{slot.description}</Text> : null}
                  </View>

                  {/* Status Badge */}
                  <View className={`items-end rounded-md px-2 py-1.5 ${slot.status === "AVAILABLE" ? "bg-success/15" : "bg-border/50"}`}>
                    <Text
                      className={`mb-0.5 text-[10px] font-bold ${
                        slot.status === "AVAILABLE"
                          ? "text-success"
                          : slot.status === "Limited Slot"
                            ? "text-warning"
                            : "text-text-secondary"
                      }`}
                    >
                      {slot.status}
                    </Text>
                  </View>
                </TouchableOpacity>
              )
            })}
          </View>
        </View>
      </ScrollView>

      {/* ================= STICKY BOTTOM BAR ================= */}
      {selectedTime?.status === "AVAILABLE" ? (
        <View className="absolute bottom-0 left-0 right-0 flex-row items-center justify-between border-t border-border bg-surface p-5 pb-8">
          <View>
            <Text className="mb-1 text-[9px] font-bold uppercase tracking-widest text-text-secondary">Sesi Dipilih</Text>
            <Text className="mb-0.5 text-sm font-bold text-text-primary">
              {dateText} • {`${selectedTime.startTime.substring(11, 16)} - ${selectedTime.endTime.substring(11, 16)}`}
            </Text>
          </View>
          <TouchableOpacity
            onPress={onNext}
            className="flex-row items-center gap-2 rounded-xl bg-primary px-6 py-3.5"
          >
            <Text className="text-sm font-bold text-white">Lanjutkan</Text>
            <Ionicons
              name="arrow-forward"
              size={16}
              color="white"
            />
          </TouchableOpacity>
        </View>
      ) : null}
    </SafeAreaView>
  )
}
