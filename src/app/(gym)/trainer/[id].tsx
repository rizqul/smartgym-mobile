import { getTrainerSlot } from "@/service/trainer.service"
import { fetchTrainers } from "@/store/slice/trainerSlice"
import { AppDispatch, RootState } from "@/store/store"
import { Trainer, TrainerSlot } from "@/type/Trainer.type"
import { generateUpcomingDates } from "@/utils/dateHelper"
import { formatRange } from "@/utils/FormaterHelper"
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"
import { useLocalSearchParams, useRouter } from "expo-router"
import React, { useEffect, useMemo, useState } from "react"
import { Image, ScrollView, StatusBar, Text, TouchableOpacity, View } from "react-native"
import { ALERT_TYPE, Toast } from "react-native-alert-notification"
import { SafeAreaView } from "react-native-safe-area-context"
import { useDispatch, useSelector } from "react-redux"

const DATE_LOCALE = "en-US"

const STATUS_PASSED = "PASSED"

const getSlotStatus = (slot: TrainerSlot, now: number): string => {
  const start = new Date(slot.startTime).getTime()
  if (!Number.isNaN(start) && start <= now) return STATUS_PASSED
  return slot.status
}

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
  const [now, setNow] = useState(() => Date.now())
  const firstDate = new Date(dates[0].fullDate).toLocaleDateString(DATE_LOCALE, { month: "short" })
  const lastDate = new Date(dates[13].fullDate).toLocaleDateString(DATE_LOCALE, { month: "short" })
  const lastYear = new Date(dates[13].fullDate).getFullYear()
  const month = firstDate === lastDate ? `${firstDate}` : `${firstDate} - ${lastDate} ${lastYear}`

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 60_000)
    return () => clearInterval(timer)
  }, [])

  const slots = useMemo(() => timeSlots.map((slot) => ({ ...slot, status: getSlotStatus(slot, now) })), [timeSlots, now])

  const isSelectedValid = !!selectedTime && getSlotStatus(selectedTime, now) === "AVAILABLE"

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

  const dateText = new Date(selectedDate).toLocaleDateString(DATE_LOCALE, {
    day: "numeric",
    month: "short",
    year: "numeric"
  })

  const availableCount = slots.filter((s) => s.status === "AVAILABLE").length

  const onNext = () => {
    if (!selectedTime?.id) {
      Toast.show({
        type: ALERT_TYPE.WARNING,
        title: "Select a Slot",
        textBody: "Please select a schedule slot before continuing.",
        autoClose: 3000
      })
      return
    }

    if (!isSelectedValid) {
      setSelectedTime(null)
      Toast.show({
        type: ALERT_TYPE.WARNING,
        title: "Slot Unavailable",
        textBody: "This slot's time has already passed, please choose another slot.",
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
          <Text className="font-inter text-lg font-bold text-text-primary">Trainer Schedule</Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="pb-32"
      >
        {/* ================= HERO SECTION ================= */}
        <View className="mb-6 px-5">
          <View className="overflow-hidden rounded-3xl border border-border bg-surface">
            {/* Photo */}
            <View className="h-[240px] w-full bg-border/30">
              <Image
                source={{
                  uri: data?.profileUrl ?? "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=600&auto=format&fit=crop"
                }}
                className="h-full w-full"
                resizeMode="cover"
              />

              {/* Soft fade at the bottom of the photo to blend into the card */}
              <LinearGradient
                colors={["transparent", "#1A1D24"]}
                pointerEvents="none"
                style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 80 }}
              />

              {/* Badge */}
              <View className="absolute left-4 top-4 flex-row items-center gap-1.5 rounded-full border border-success/40 bg-background/80 px-3 py-1.5">
                <View className="h-1.5 w-1.5 rounded-full bg-success" />
                <Text className="font-inter text-[10px] font-bold text-text-primary">Ready to Book</Text>
              </View>
            </View>

            {/* Trainer info */}
            <View className="gap-3 px-5 pb-5 pt-2">
              <Text className="font-inter text-2xl font-bold text-text-primary">Coach {data?.name}</Text>

              <View className="flex-row items-center gap-1.5 self-start rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5">
                <MaterialCommunityIcons
                  name="arm-flex"
                  size={14}
                  color="#FF8A33"
                />
                <Text className="font-inter text-xs font-semibold text-primary-hover">{data?.specialization}</Text>
              </View>
              <View className="h-px bg-border" />
              {/* Stats */}
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
                    <Text className="font-inter text-base font-bold text-text-primary">{loading ? "-" : availableCount}</Text>
                    <Text className="font-inter text-[10px] text-text-secondary">Available Slots</Text>
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
                    <Text className="font-inter text-base font-bold text-text-primary">{data?.experience} Yrs</Text>
                    <Text className="font-inter text-[10px] text-text-secondary">Experience</Text>
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
              <Text className="mb-1 font-inter text-xl font-bold text-text-primary">Available Schedule</Text>
              <Text className="font-inter text-sm text-text-secondary">Pick a date for your training session</Text>
            </View>
            <Text className="font-inter text-[10px] font-bold tracking-widest text-primary">{month}</Text>
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
                  <Text className={`mb-1 font-inter text-[10px] ${isActive ? "text-white" : "text-text-secondary"}`}>{item.day}</Text>
                  <Text className={`font-inter text-xl font-bold ${isActive ? "text-white" : "text-text-primary"}`}>{item.date}</Text>
                  {/* Dot Indicator */}
                  <View
                    className={`mt-1 h-1.5 w-1.5 rounded-full ${isActive ? "bg-white" : item.hasDot ? "bg-success" : "bg-transparent"}`}
                  />
                </TouchableOpacity>
              )
            })}
          </ScrollView>

          <View className="mb-3 flex-row items-center justify-between">
            <Text className="font-inter text-base font-bold text-text-primary">Training Slots ({dateText})</Text>
            <Text className="font-inter text-sm font-bold text-text-secondary">WIB (UTC+7)</Text>
          </View>

          {/* Time Slots List */}
          <View className="gap-3">
            {slots.map((slot) => {
              const time = formatRange(slot.startTime, slot.endTime)
              const isAvailable = slot.status === "AVAILABLE"
              const isSelected = selectedTime?.id === slot.id && isAvailable

              return (
                <TouchableOpacity
                  key={slot.id}
                  disabled={!isAvailable}
                  onPress={() => setSelectedTime(slot)}
                  className={`flex-row items-center rounded-2xl border p-4 ${
                    isSelected ? "border-primary bg-surface" : "border-border bg-card"
                  } ${!isAvailable ? "opacity-50" : ""}`}
                >
                  {/* Icon */}
                  <View
                    className={`mr-3 h-10 w-10 items-center justify-center rounded-full ${isSelected ? "bg-primary" : "bg-background"}`}
                  >
                    <Ionicons
                      name="time-outline"
                      size={20}
                      color={isSelected ? "white" : "#B8BDC7"}
                    />
                  </View>

                  {/* Time & Title */}
                  <View className="flex-1">
                    <Text className="mb-0.5 font-inter text-sm font-bold text-text-primary">{time}</Text>
                    {slot.description ? <Text className="font-inter text-[11px] text-text-secondary">{slot.description}</Text> : null}
                  </View>

                  {/* Status Badge (AVAILABLE / BOOKED / PASSED) */}
                  <View className={`items-end rounded-md px-2 py-1.5 ${isAvailable ? "bg-success/15" : "bg-border/50"}`}>
                    <Text
                      className={`mb-0.5 font-inter text-[10px] font-bold ${
                        isAvailable ? "text-success" : slot.status === "BOOKED" ? "text-warning" : "text-text-secondary"
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
      {isSelectedValid && selectedTime ? (
        <View className="absolute bottom-0 left-0 right-0 flex-row items-center justify-between border-t border-border bg-surface p-5 pb-8">
          <View>
            <Text className="mb-1 font-inter text-[9px] font-bold uppercase tracking-widest text-text-secondary">Selected Session</Text>
            <Text className="mb-0.5 font-inter text-sm font-bold text-text-primary">
              {dateText} • {formatRange(selectedTime.startTime, selectedTime.endTime)}
            </Text>
          </View>
          <TouchableOpacity
            onPress={onNext}
            className="flex-row items-center gap-2 rounded-xl bg-primary px-6 py-3.5"
          >
            <Text className="font-inter text-sm font-bold text-white">Continue</Text>
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
