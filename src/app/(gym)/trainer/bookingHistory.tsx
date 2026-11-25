import HeaderNavigation from "@/components/gym/templates/headerNavigation"
import { BookingHistory } from "@/type/booking.type"
import { getTimezoneLabel } from "@/utils/timeZoneHelper"
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"
import { useRouter } from "expo-router"
import React, { useMemo, useState } from "react"
import { ActivityIndicator, Image, ScrollView, StatusBar, Text, TouchableOpacity, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

type TabKey = "upcoming" | "done"

const TABS: { key: TabKey; label: string }[] = [
  { key: "upcoming", label: "Mendatang" },
  { key: "done", label: "Selesai" }
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
  if (h === 0) return `${m} menit`
  return m === 0 ? `${h} jam` : `${h} jam ${m} menit`
}

/* ---------- DATA CONTOH: ganti dengan data dari service ---------- */
const MOCK_BOOKINGS: BookingHistory[] = [
  {
    id: "1",
    bookedAt: "2026-11-24T09:15:00",
    status: "PAID",
    trainer: { id: "t1", name: "Rio Pratama", specialization: "STRENGTH_CONDITIONING" },
    slot: { startTime: "2026-11-28T08:00:00", endTime: "2026-11-28T09:00:00" }
  },
  {
    id: "2",
    bookedAt: "2026-11-10T14:30:00",
    status: "PAID",
    trainer: { id: "t2", name: "Sari Dewi", specialization: "WEIGHT_LOSS" },
    slot: { startTime: "2026-11-12T17:00:00", endTime: "2026-11-12T18:20:00" }
  },
  {
    id: "3",
    bookedAt: "2026-10-30T10:00:00",
    status: "CANCELLED",
    trainer: { id: "t3", name: "Andi Saputra", specialization: "BODYBUILDING" },
    slot: { startTime: "2026-11-02T19:00:00", endTime: "2026-11-02T20:00:00" }
  }
]

function StatusBadge({ status }: Readonly<{ status?: BookingHistory["status"] }>) {
  if (status === "CANCELLED") {
    return (
      <View className="flex-row items-center gap-1 rounded-md border border-danger/30 bg-danger/10 px-2 py-1">
        <View className="h-1.5 w-1.5 rounded-full bg-danger" />
        <Text className="text-[10px] font-bold text-danger">Dibatalkan</Text>
      </View>
    )
  }
  if (status === "PENDING") {
    return (
      <View className="flex-row items-center gap-1 rounded-md border border-secondary/30 bg-secondary/10 px-2 py-1">
        <View className="h-1.5 w-1.5 rounded-full bg-secondary" />
        <Text className="text-[10px] font-bold text-secondary">Belum Dibayar</Text>
      </View>
    )
  }
  if (status === "PAID") {
    return (
      <View className="flex-row items-center gap-1 rounded-md border border-success/30 bg-success/10 px-2 py-1">
        <View className="h-1.5 w-1.5 rounded-full bg-success" />
        <Text className="text-[10px] font-bold text-success">Terbayar</Text>
      </View>
    )
  }
  return null
}

function BookingCard({ item, isUpcoming }: Readonly<{ item: BookingHistory; isUpcoming: boolean }>) {
  const router = useRouter()
  const [imageFailed, setImageFailed] = useState(false)
  const { trainer, slot } = item

  const start = new Date(slot.startTime)
  const hasPhoto = !!trainer.profileUrl && !imageFailed && !GENERATED_AVATAR.test(trainer.profileUrl)
  const cancelled = item.status === "CANCELLED"

  const day = start.toLocaleDateString("id-ID", { day: "numeric" })
  const month = start.toLocaleDateString("id-ID", { month: "short" }).toUpperCase()
  const weekday = start.toLocaleDateString("id-ID", { weekday: "long" })
  const timeText = `${slot.startTime.substring(11, 16)} - ${slot.endTime.substring(11, 16)}`
  const bookedText = new Date(item.bookedAt).toLocaleDateString("id-ID", {
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
          <Text className={`text-2xl font-bold ${isUpcoming && !cancelled ? "text-primary" : "text-text-body"}`}>{day}</Text>
          <Text className="text-[10px] font-bold tracking-wide text-text-subdued">{month}</Text>
        </View>

        <View className="flex-1 gap-1.5">
          <View className="flex-row items-start justify-between gap-2">
            <Text className="text-base font-bold text-text-primary">{weekday}</Text>
            <StatusBadge status={item.status} />
          </View>

          <View className="flex-row items-center gap-1.5">
            <Ionicons
              name="time-outline"
              size={14}
              color="#FFB693"
            />
            <Text className="text-sm font-semibold text-accent">{timeText}</Text>
            <Text className="text-[11px] text-text-subdued">{getTimezoneLabel()}</Text>
          </View>

          <Text className="text-[11px] text-text-secondary">Durasi {formatDuration(slot.startTime, slot.endTime)}</Text>
        </View>
      </View>

      <View className="h-px bg-border" />

      {/* Trainer */}
      <View className="flex-row items-center gap-3 bg-card p-4">
        {hasPhoto ? (
          <Image
            source={{ uri: trainer.profileUrl }}
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
              <Text className="text-base font-extrabold text-accent">{getInitials(trainer.name)}</Text>
            </LinearGradient>
          </View>
        )}

        <View className="flex-1 gap-1">
          <Text className="text-[10px] font-semibold uppercase tracking-wide text-text-subdued">Coach</Text>
          <Text
            className="text-sm font-bold text-text-primary"
            numberOfLines={1}
          >
            {trainer.name}
          </Text>
          <Text
            className="text-[11px] text-primary-hover"
            numberOfLines={1}
          >
            {formatLabel(trainer.specialization)}
          </Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => router.push({ pathname: "/(gym)/trainer/[id]", params: { id: trainer.id } })}
          className="flex-row items-center gap-1 rounded-xl border border-primary/40 bg-primary/10 px-3 py-2"
        >
          <Text className="text-xs font-bold text-primary-hover">{isUpcoming ? "Lihat" : "Booking Lagi"}</Text>
          <Ionicons
            name="arrow-forward"
            size={12}
            color="#FF8A33"
          />
        </TouchableOpacity>
      </View>

      {/* Footer: tanggal booking dibuat */}
      <View className="flex-row items-center gap-1.5 px-4 py-2.5">
        <MaterialCommunityIcons
          name="history"
          size={13}
          color="#6B7280"
        />
        <Text className="text-[11px] text-text-muted">Dipesan pada {bookedText}</Text>
      </View>
    </View>
  )
}

export default function BookingHistoryScreen() {
  const [tab, setTab] = useState<TabKey>("upcoming")
  const [loading] = useState(false) // ganti saat data diambil dari server
  const [bookings] = useState<BookingHistory[]>(MOCK_BOOKINGS) // ganti dengan data asli

  const { upcoming, done } = useMemo(() => {
    const now = Date.now()
    const isUpcoming = (b: BookingHistory) => b.status !== "CANCELLED" && new Date(b.slot.endTime).getTime() > now

    return {
      // mendatang: yang paling dekat di atas
      upcoming: bookings.filter(isUpcoming).sort((a, b) => a.slot.startTime.localeCompare(b.slot.startTime)),
      // selesai & dibatalkan: yang terbaru di atas
      done: bookings.filter((b) => !isUpcoming(b)).sort((a, b) => b.slot.startTime.localeCompare(a.slot.startTime))
    }
  }, [bookings])

  const list = tab === "upcoming" ? upcoming : done

  return (
    <SafeAreaView className="flex-1 bg-background">
      <StatusBar barStyle="light-content" />

      <HeaderNavigation label="Riwayat Booking" />

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
                  <Text className={`text-xs ${active ? "font-bold text-primary" : "font-semibold text-text-secondary"}`}>{t.label}</Text>
                  <View className={`min-w-5 items-center rounded-full px-1.5 py-0.5 ${active ? "bg-primary" : "bg-card"}`}>
                    <Text className={`text-[10px] font-bold ${active ? "text-background" : "text-text-subdued"}`}>{count}</Text>
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
        ) : list.length === 0 ? (
          <View className="items-center gap-3 py-14">
            <View className="h-20 w-20 items-center justify-center rounded-full border border-border bg-surface">
              <MaterialCommunityIcons
                name={tab === "upcoming" ? "calendar-blank-outline" : "history"}
                size={36}
                color="#6B7280"
              />
            </View>
            <Text className="text-sm font-bold text-text-primary">
              {tab === "upcoming" ? "Belum ada sesi mendatang" : "Belum ada riwayat sesi"}
            </Text>
            <Text className="px-8 text-center text-xs leading-5 text-text-secondary">
              {tab === "upcoming"
                ? "Booking sesi bersama trainer dan jadwalmu akan muncul di sini."
                : "Sesi yang sudah selesai atau dibatalkan akan tampil di sini."}
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
