import { formatRupiah, toTitleCase } from "@/utils/FormaterHelper"
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

const ACCENT = "#FFB693"
const MUTED = "#B8BDC7"

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

export const TrainerCard = ({ data }: Props) => {
  const { id, name, profileUrl, specialization, experience, rate } = data
  const [imageFailed, setImageFailed] = useState(false)

  const years = String(experience).match(/\d+/)?.[0] ?? String(experience)
  const hasPhoto = !!profileUrl && !imageFailed && !GENERATED_AVATAR.test(profileUrl)

  return (
    <LinearGradient
      colors={["#3A2016", "#1F1D22", "#1A1D24"]}
      locations={[0, 0.5, 1]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      className="gap-3 overflow-hidden border border-primary/15"
      style={{ padding: 16, borderRadius: 16 }}
    >
      <View className="mb-5 flex-row items-start gap-4">
        {/* Avatar */}
        {hasPhoto ? (
          <Image
            source={{ uri: profileUrl }}
            onError={() => setImageFailed(true)}
            className="w-[120px] self-stretch rounded-xl border border-border bg-surface"
            style={{ minHeight: 120 }}
            resizeMode="cover"
          />
        ) : (
          <View
            className="w-[120px] self-stretch overflow-hidden rounded-xl border border-primary/20"
            style={{ minHeight: 120 }}
          >
            <LinearGradient
              colors={["#5A3320", "#242833"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
            >
              <Text className="font-inter text-4xl font-extrabold text-accent">{getInitials(name)}</Text>
            </LinearGradient>
          </View>
        )}

        <View className="flex-1 justify-start gap-3">
          <Text
            className="font-inter text-xl font-extrabold leading-tight tracking-tight text-text-primary"
            style={{ includeFontPadding: false }}
            numberOfLines={2}
          >
            {toTitleCase(name)}
          </Text>

          {/* Badge Specialization */}
          <View className="flex-row items-center gap-1.5 self-start rounded-full border border-primary/40 bg-primary/10 px-3 py-1">
            <View className="h-1.5 w-1.5 rounded-full bg-primary" />
            <Text className="font-inter text-[10px] font-bold uppercase tracking-wide text-primary-hover">
              {formatLabel(specialization)}
            </Text>
          </View>

          {/* Pengalaman */}
          <View className="flex-row items-center gap-1.5 self-start rounded-lg bg-card px-2.5 py-1.5">
            <Ionicons
              name="time-outline"
              size={13}
              color={MUTED}
            />
            <Text className="font-inter text-xs text-text-body">{years} years of experience</Text>
          </View>

          {/* Harga */}
          <View className="flex-row items-end gap-1">
            <Text className="font-inter text-xl font-bold text-accent">{formatRupiah(rate)}</Text>
            <Text className="mb-[3px] font-inter text-xs text-text-subdued">/ session</Text>
          </View>
        </View>
      </View>

      {/* Divider */}
      <View className="h-px bg-border" />

      {/* Action Button */}
      <TouchableOpacity
        activeOpacity={0.85}
        className="flex-row items-center justify-center gap-2 rounded-xl bg-primary py-3.5"
        onPress={() =>
          router.push({
            pathname: "/(gym)/trainer/trainerDetail",
            params: { id: id }
          })
        }
      >
        <Text className="font-inter text-sm font-bold text-background">View Schedule & Book</Text>
        <Ionicons
          name="arrow-forward"
          size={16}
          color="#111317"
        />
      </TouchableOpacity>
    </LinearGradient>
  )
}
