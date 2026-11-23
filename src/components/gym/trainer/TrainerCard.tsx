import { Ionicons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"
import { router } from "expo-router"
import { useState } from "react"
import { Image, Text, TouchableOpacity, View } from "react-native"

type TrainerData = {
  id: string
  name: string
  profileUrl?: string
  specialization: string
  experience: number | string
  rate: number
}

type Props = {
  data: TrainerData
}

const PRIMARY = "#FF6B00"
const ACCENT = "#FFB693"

const GENERATED_AVATAR = /ui-avatars|dicebear|initials|avatar\.iran|gravatar/i

const formatLabel = (value: string) =>
  value
    .replace(/[_-]+/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase())

export const TrainerCard = ({ data }: Props) => {
  const { id, name, profileUrl, specialization, experience, rate } = data
  const [imageFailed, setImageFailed] = useState(false)

  const years = String(experience).match(/\d+/)?.[0] ?? String(experience)
  const hasPhoto = !!profileUrl && !imageFailed && !GENERATED_AVATAR.test(profileUrl)

  return (
    <LinearGradient
      colors={["#2E1A14", "#1A1D24", "#1A1D24"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      className="gap-3 overflow-hidden border border-border/50"
      style={{ padding: 16, borderRadius: 16 }}
    >
      <View className="mb-5 flex-row items-start gap-4">
        <Image
          source={{ uri: profileUrl }}
          className="h-full w-[120px] rounded-xl border border-border/50 bg-surface"
          resizeMode="cover"
        />
        <View className="flex-1 justify-start gap-3">
          <Text
            className="text-xl font-extrabold leading-tight tracking-tight text-text-primary"
            style={{ includeFontPadding: false }}
          >
            {name}
          </Text>

          {/* Badge Specialization */}
          <View className="flex-row items-center gap-1.5 self-start rounded-full border border-primary/40 bg-primary/10 px-3 py-1">
            <View className="h-1.5 w-1.5 rounded-full bg-primary" />
            <Text className="text-[10px] font-bold uppercase tracking-wide text-primary">{specialization}</Text>
          </View>

          <View className="flex-row items-center gap-3">
            <View className="flex-row items-center gap-1">
              <Ionicons
                name="time-outline"
                size={12}
                color="#B8BDC7"
              />
              <Text className="text-xs text-text-secondary">{experience} tahun pengalaman</Text>
            </View>
          </View>

          {/* Harga */}
          <View className="flex-row items-end gap-1">
            <Text className="text-xl font-bold text-text-primary">Rp {rate}</Text>
            <Text className="mb-[3px] text-xs text-text-secondary">/ sesi</Text>
          </View>
        </View>
      </View>

      {/* Divider */}
      <View className="h-px bg-border/40" />

      {/* Action Button */}
      <TouchableOpacity
        className={`flex-row items-center justify-center gap-2 rounded-xl bg-primary py-3.5`}
        onPress={() =>
          router.push({
            pathname: "/(gym)/trainer/[id]",
            params: { id: id }
          })
        }
      >
        <Text className={`text-sm font-bold text-white`}>Lihat Jadwal & Booking</Text>
        <Ionicons
          name="arrow-forward"
          size={16}
          color="white"
        />
      </TouchableOpacity>
    </LinearGradient>
  )
}
