import HeaderNavigation from "@/components/gym/templates/headerNavigation"
import { fetchMyBookings } from "@/store/slice/trainerBookingSlice"
import { AppDispatch, RootState } from "@/store/store"
import { TrainerBookingResponse } from "@/type/trainerBooking.type"
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"
import { useFocusEffect, useRouter } from "expo-router"
import React, { useCallback, useMemo, useState } from "react"
import { ActivityIndicator, Image, ScrollView, StatusBar, Text, TouchableOpacity, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useDispatch, useSelector } from "react-redux"

type TabKey = "upcoming" | "done"
type BookingStatus = "PAID" | "PENDING" | "CANCELLED"

const TABS: { key: TabKey; label: string }[] = [
  { key: "upcoming", label: "Upcoming" },
  { key: "done", label: "Done" }
]

const GENERATED_AVATAR = /ui-avatars|dicebear|initials|avatar\.iran|gravatar/i

const formatLabel = (value: string) =>
  value
    .replace(/[_-]+/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase())

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
  if (h === 0) return `${m} min`
  return m === 0 ? `${h} hr` : `${h} hr ${m} min`
}

// SESUAIKAN dengan nilai asli slot.status dari backend
const getBookingStatus = (slotStatus?: string): BookingStatus => {
  const s = (slotStatus ?? "").toUpperCase()
  if (s.includes("CANCEL")) return "CANCELLED"
  if (s.includes("PENDING")) return "PENDING"
  return "PAID"
}

function StatusBadge({ status }: Readonly<{ status?: BookingStatus }>) {
  if (status === "CANCELLED") {
    return (
      <View className="flex-row items-center gap-1 rounded-md border border-danger/30 bg-danger/10 px-2 py-1">
        <View className="h-1.5 w-1.5 rounded-full bg-danger" />
        <Text className="font-inter text-[10px] font-bold text-danger">Cancelled</Text>
      </View>
    )
  }
  if (status === "PENDING") {
    return (
      <View className="flex-row items-center gap-1 rounded-md border border-secondary/30 bg-secondary/10 px-2 py-1">
        <View className="h-1.5 w-1.5 rounded-full bg-secondary" />
        <Text className="font-inter text-[10px] font-bold text-secondary">Unpaid</Text>
      </View>
    )
  }
  if (status === "PAID") {
    return (
      <View className="flex-row items-center gap-1 rounded-md border border-success/30 bg-success/10 px-2 py-1">
        <View className="h-1.5 w-1.5 rounded-full bg-success" />
        <Text className="font-inter text-[10px] font-bold text-success">PAID</Text>
      </View>
    )
  }
  return null
}

function BookingCard({ item, isUpcoming }: Readonly<{ item: TrainerBookingResponse; isUpcoming: boolean }>) {
  const router = useRouter()
  const [imageFailed, setImageFailed] = useState(false)
  const { trainer, slot } = item

  const status = getBookingStatus(slot.status)
  const start = new Date(slot.startTime)
  const hasPhoto = !!trainer.profileUrl && !imageFailed && !GENERATED_AVATAR.test(trainer.profileUrl)
  const cancelled = status === "CANCELLED"

  const day = start.toLocaleDateString("en-US", { day: "numeric" })
  const month = start.toLocaleDateString("en-US", { month: "short" }).toUpperCase()
  const weekday = start.toLocaleDateString("en-US", { weekday: "long" })
  const timeText = `${slot.startTime.substring(11, 16)} - ${slot.endTime.substring(11, 16)}`
  const bookedText = new Date(slot.updatedAt).toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric"
  })

  return (
    <View className={`overflow-hidden rounded-2xl border border-border bg-surface ${cancelled ? "opacity-70" : ""}`}>
      {/* Header: tanggal sesi + status */}
      <View className="flex-row items-center gap-4 p-4">
        <View
          className={`h-16 w-16 items-center justify-center rounded-xl border ${
            isUpcoming && !cancelled ? "border-primary/40 bg-primary/10" : "border-border bg-card"
          }`}
        >
          <Text className={`font-inter text-2xl font-bold ${isUpcoming && !cancelled ? "text-primary" : "text-text-body"}`}>{day}</Text>
          <Text className="font-inter text-[10px] font-bold tracking-wide text-text-subdued">{month}</Text>
        </View>

        <View className="flex-1 gap-1.5">
          <View className="flex-row items-start justify-between gap-2">
            <Text className="font-inter text-base font-bold text-text-primary">{weekday}</Text>
            <StatusBadge status={status} />
          </View>

          <View className="flex-row items-center gap-1.5">
            <Ionicons
              name="time-outline"
              size={14}
              color="#FFB693"
            />
            <Text className="font-inter text-sm font-semibold text-accent">{timeText}</Text>
            <Text className="font-inter text-[11px] text-text-subdued">WIB</Text>
          </View>

          <Text className="font-inter text-[11px] text-text-secondary">Duration {formatDuration(slot.startTime, slot.endTime)}</Text>
        </View>
      </View>

      <View className="h-px bg-border" />

      {/* Trainer */}
      <View className="flex-row items-center gap-3 bg-card p-4">
        {hasPhoto ? (
          <Image
            source={{ uri: trainer.profileUrl as string }}
            onError={() => setImageFailed(true)}
            className="h-12 w-12 rounded-xl bg-surface"
            resizeMode="cover"
          />
        ) : (
          <View className="h-12 w-12 overflow-hidden rounded-xl border border-primary/20">
            <LinearGradient
              colors={["#5A3320", "#242833"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
            >
              <Text className="font-inter text-base font-extrabold text-accent">{getInitials(trainer.name)}</Text>
            </LinearGradient>
          </View>
        )}

        <View className="flex-1 gap-1">
          <Text className="font-inter text-[10px] font-semibold uppercase tracking-wide text-text-subdued">Coach</Text>
          <Text
            className="font-inter text-sm font-bold text-text-primary"
            numberOfLines={1}
          >
            {trainer.name}
          </Text>
          <Text
            className="font-inter text-[11px] text-primary-hover"
            numberOfLines={1}
          >
            {formatLabel(String(trainer.specialization))}
          </Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => router.push({ pathname: "/(gym)/trainer/[id]", params: { id: trainer.id } })}
          className="flex-row items-center gap-1 rounded-xl border border-primary/40 bg-primary/10 px-3 py-2"
        >
          <Text className="font-inter text-xs font-bold text-primary-hover">{isUpcoming ? "View Trainer" : "Book Again"}</Text>
          <Ionicons
            name="arrow-forward"
            size={12}
            color="#FF8A33"
          />
        </TouchableOpacity>
      </View>

      {/* Footer */}
      <View className="flex-row items-center gap-1.5 px-4 py-2.5">
        <MaterialCommunityIcons
          name="history"
          size={13}
          color="#6B7280"
        />
        <Text className="font-inter text-[11px] text-text-muted">Booked on {bookedText}</Text>
      </View>
    </View>
  )
}

export default function BookingHistoryScreen() {
  const dispatch = useDispatch<AppDispatch>()
  const { result, isLoading, error } = useSelector((state: RootState) => state.trainerBooking)
  const [tab, setTab] = useState<TabKey>("upcoming")

  // fetch setiap layar dibuka, jadi booking baru langsung muncul
  useFocusEffect(
    useCallback(() => {
      dispatch(fetchMyBookings({ size: 50 }))
    }, [dispatch])
  )

  const { upcoming, done, total } = useMemo(() => {
    const bookings = result?.data ?? []
    const now = Date.now()
    const isUpcoming = (b: TrainerBookingResponse) =>
      getBookingStatus(b.slot.status) !== "CANCELLED" && new Date(b.slot.endTime).getTime() > now

    return {
      total: bookings.length,
      upcoming: bookings.filter(isUpcoming).sort((a, b) => a.slot.startTime.localeCompare(b.slot.startTime)),
      done: bookings.filter((b) => !isUpcoming(b)).sort((a, b) => b.slot.startTime.localeCompare(a.slot.startTime))
    }
  }, [result?.data])

  const list = tab === "upcoming" ? upcoming : done
  const loading = isLoading && total === 0

  return (
    <SafeAreaView className="flex-1 bg-background">
      <StatusBar barStyle="light-content" />

      <HeaderNavigation label="Booking History" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="px-5 pt-4 pb-12 gap-5"
        stickyHeaderIndices={[0]}
      >
        {/* TAB (sticky) */}
        <View className="bg-background pb-1">
          <View className="flex-row gap-1 rounded-xl border border-border bg-surface p-1">
            {TABS.map((t) => {
              const active = tab === t.key
              const count = t.key === "upcoming" ? upcoming.length : done.length
              return (
                <TouchableOpacity
                  key={t.key}
                  activeOpacity={0.8}
                  onPress={() => setTab(t.key)}
                  className={`flex-1 flex-row items-center justify-center gap-2 rounded-lg border py-2.5 ${
                    active ? "border-primary/40 bg-primary/15" : "border-transparent"
                  }`}
                >
                  <Text className={`font-inter text-xs ${active ? "font-bold text-primary" : "font-semibold text-text-secondary"}`}>
                    {t.label}
                  </Text>
                  <View className={`min-w-5 items-center rounded-full px-1.5 py-0.5 ${active ? "bg-primary" : "bg-card"}`}>
                    <Text className={`font-inter text-[10px] font-bold ${active ? "text-background" : "text-text-subdued"}`}>{count}</Text>
                  </View>
                </TouchableOpacity>
              )
            })}
          </View>
        </View>

        {/* LIST */}
        {loading ? (
          <ActivityIndicator
            size="large"
            color="#FF6B00"
            className="mt-10"
          />
        ) : error && total === 0 ? (
          <View className="items-center gap-3 py-14">
            <Ionicons
              name="alert-circle-outline"
              size={40}
              color="#B8BDC7"
            />
            <Text className="font-inter text-sm font-bold text-text-primary">Failed to load bookings</Text>
            <TouchableOpacity onPress={() => dispatch(fetchMyBookings({ size: 50 }))}>
              <Text className="font-inter text-xs font-bold text-primary">Try again</Text>
            </TouchableOpacity>
          </View>
        ) : list.length === 0 ? (
          <View className="items-center gap-3 py-14">
            <View className="h-20 w-20 items-center justify-center rounded-full border border-border bg-surface">
              <MaterialCommunityIcons
                name={tab === "upcoming" ? "calendar-blank-outline" : "history"}
                size={36}
                color="#6B7280"
              />
            </View>
            <Text className="font-inter text-sm font-bold text-text-primary">
              {tab === "upcoming" ? "No upcoming sessions" : "No session history"}
            </Text>
            <Text className="px-8 text-center font-inter text-xs leading-5 text-text-secondary">
              {tab === "upcoming"
                ? "Book a session with a trainer and your schedule will appear here."
                : "Completed or cancelled sessions will appear here."}
            </Text>
          </View>
        ) : (
          <View className="gap-4">
            {list.map((item) => (
              <BookingCard
                key={item.id}
                item={item}
                isUpcoming={tab === "upcoming"}
              />
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}
