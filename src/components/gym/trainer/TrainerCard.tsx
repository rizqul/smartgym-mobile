import { Ionicons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"
import { useState } from "react"
import { Image, Pressable, Text, View } from "react-native"

type TrainerData = {
  name: string
  profileUrl?: string
  specialization: string
  experience: number | string // contoh: 5 atau "5 tahun"
}

type Props = {
  data: TrainerData
  handleShow: (id: string) => void
}

// Samakan dengan tailwind.config.js
const PRIMARY = "#FF6B00"
const ACCENT = "#FFB693"

// Url avatar inisial otomatis (mis. "TE") dianggap sebagai "tidak ada foto".
// Sesuaikan pola ini dengan layanan avatar yang dipakai backend Anda.
const GENERATED_AVATAR = /ui-avatars|dicebear|initials|avatar\.iran|gravatar/i

// CARDIO_ENDURANCE -> Cardio Endurance (hanya tampilan, data tidak diubah)
const formatLabel = (value: string) =>
  value
    .replace(/[_-]+/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase())

export const TrainerCard = ({ data, handleShow }: Props) => {
  const { name, profileUrl, specialization, experience } = data
  const [imageFailed, setImageFailed] = useState(false)

  const years = String(experience).match(/\d+/)?.[0] ?? String(experience)
  const hasPhoto = !!profileUrl && !imageFailed && !GENERATED_AVATAR.test(profileUrl)

  return (
    <Pressable
      // Hover (web) & feedback tekan: naik sedikit + shadow lebih jelas
      style={({ pressed, hovered }: any) => ({
        transform: [{ scale: pressed ? 0.985 : hovered ? 1.01 : 1 }],
        shadowColor: "#000",
        shadowOffset: { width: 0, height: hovered ? 14 : 8 },
        shadowOpacity: hovered ? 0.35 : 0.25,
        shadowRadius: hovered ? 24 : 16,
        elevation: hovered ? 10 : 6
      })}
    >
      <View className="overflow-hidden rounded-3xl border border-border">
        {/* Background gradient halus */}
        <LinearGradient
          pointerEvents="none"
          colors={["#2B303D", "#242833", "#1E222B"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ position: "absolute", top: 0, bottom: 0, left: 0, right: 0 }}
        />
        {/* Glow oranye tipis di pojok kiri atas */}
        <LinearGradient
          pointerEvents="none"
          colors={["rgba(255,107,0,0.12)", "rgba(255,107,0,0)"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0.8, y: 0.6 }}
          style={{ position: "absolute", top: 0, bottom: 0, left: 0, right: 0 }}
        />

        <View className="px-5 pt-5">
          {/* Info + foto */}
          <View className="flex-row gap-4">
            {/* Kiri */}
            <View className="flex-1 justify-between">
              <View className="gap-4">
                <Text
                  className="text-2xl font-bold leading-8 text-text-primary"
                  style={{ includeFontPadding: false }}
                  numberOfLines={2}
                >
                  {name}
                </Text>

                <View className="gap-1">
                  <Text className="text-[10px] font-semibold uppercase tracking-[2px] text-text-muted">Spesialisasi</Text>
                  <Text
                    className="text-sm font-medium text-accent"
                    numberOfLines={2}
                  >
                    {formatLabel(specialization)}
                  </Text>
                </View>
              </View>

              <View className="mt-5 gap-0.5">
                <Text
                  className="text-3xl font-bold text-primary"
                  style={{ includeFontPadding: false }}
                >
                  {years} tahun
                </Text>
                <Text className="text-xs text-text-secondary">pengalaman melatih</Text>
              </View>
            </View>

            {/* Kanan: foto / placeholder */}
            <View
              className="w-[40%] overflow-hidden rounded-2xl border border-border bg-surface"
              style={{ aspectRatio: 3 / 4 }}
            >
              {hasPhoto ? (
                <>
                  <Image
                    source={{ uri: profileUrl }}
                    resizeMode="cover"
                    onError={() => setImageFailed(true)}
                    style={{ width: "100%", height: "100%" }}
                  />
                  <LinearGradient
                    pointerEvents="none"
                    colors={["rgba(26,29,36,0)", "rgba(26,29,36,0.5)"]}
                    style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: "40%" }}
                  />
                </>
              ) : (
                <View className="flex-1 items-center justify-center">
                  <LinearGradient
                    pointerEvents="none"
                    colors={["rgba(255,107,0,0.22)", "rgba(255,182,147,0.04)"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={{ position: "absolute", top: 0, bottom: 0, left: 0, right: 0 }}
                  />
                  {/* Lingkaran dekoratif */}
                  <View
                    className="absolute h-28 w-28 rounded-full border border-accent/10"
                    style={{ transform: [{ scale: 1.5 }] }}
                  />
                  <View className="h-16 w-16 items-center justify-center rounded-full border border-accent/20 bg-accent/10">
                    <Ionicons
                      name="barbell-outline"
                      size={30}
                      color={ACCENT}
                    />
                  </View>
                </View>
              )}
            </View>
          </View>

          {/* Tombol */}
          <Pressable
            onPress={() => handleShow(name)}
            style={({ pressed, hovered }: any) => ({
              backgroundColor: pressed || hovered ? "#FF8A33" : PRIMARY,
              transform: [{ scale: pressed ? 0.98 : 1 }],
              shadowColor: PRIMARY,
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: 0.3,
              shadowRadius: 12,
              elevation: 4
            })}
            className="mt-5 h-[52px] flex-row items-center justify-center gap-2 rounded-2xl"
          >
            <Text className="text-sm font-bold text-text-primary">Lihat Jadwal & Booking</Text>
            <Ionicons
              name="arrow-forward"
              size={16}
              color="#FFFFFF"
            />
          </Pressable>
        </View>
      </View>
    </Pressable>
  )
}
