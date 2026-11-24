import { TrainerCard } from "@/components/gym/trainer/trainerCard"
import { fetchTrainers } from "@/store/slice/trainerSlice"
import { AppDispatch, RootState } from "@/store/store"
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"
import React, { useEffect, useState } from "react"
import { ScrollView, StatusBar, Text, TextInput, TouchableOpacity, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useDispatch, useSelector } from "react-redux"

const SPECIALIZATION_OPTIONS = [
  { value: "ALL", label: "All" },
  { value: "GENERAL_FITNESS", label: "General Fitness" },
  { value: "WEIGHT_LOSS", label: "Weight Loss" },
  { value: "BODYBUILDING", label: "Bodybuilding" },
  { value: "STRENGTH_CONDITIONING", label: "Strength Conditioning" },
  { value: "FUNCTIONAL_TRAINING", label: "Functional Training" },
  { value: "CARDIO_ENDURANCE", label: "Cardio & Endurance" },
  { value: "MOBILITY_FLEXIBILITY", label: "Mobility & Flexibility" },
  { value: "CORRECTIVE_REHAB", label: "Corrective & Rehab" },
  { value: "SPORTS_PERFORMANCE", label: "Sports Performance" }
] as const

export default function TrainerScreen() {
  const dispatch = useDispatch<AppDispatch>()
  const { result } = useSelector((state: RootState) => state.trainer)
  const [search, setSearch] = useState<string>("")
  const [debouncedSearch, setDebouncedSearch] = useState<string>(search)
  const [selectedSpec, setSelectedSpec] = useState<string>("ALL")
  const [searchFocused, setSearchFocused] = useState(false)

  useEffect(() => {
    const keyword = selectedSpec !== "ALL" ? selectedSpec : debouncedSearch.trim()
    void dispatch(fetchTrainers({ search: keyword, size: 50 }))
  }, [debouncedSearch, selectedSpec, dispatch])

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearch(search)
    }, 500)

    return () => {
      clearTimeout(timeoutId)
    }
  }, [search])

  const trainers = result ?? []

  return (
    <SafeAreaView className="flex-1 bg-background">
      <StatusBar barStyle="light-content" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="pb-10"
        keyboardShouldPersistTaps="handled"
        stickyHeaderIndices={[0]}
      >
        {/* ================= STICKY HEADER: SEARCH + CHIPS ================= */}
        <View className="gap-5 bg-background pb-3 pt-4">
          <View className="px-4">
            <View
              className={`flex-row items-center gap-2 rounded-full border bg-surface px-4 ${
                searchFocused ? "border-primary" : "border-border"
              }`}
            >
              <Ionicons
                name="search"
                size={20}
                color={searchFocused ? "#FF6B00" : "#B8BDC7"}
              />
              <TextInput
                value={search}
                onChangeText={setSearch}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                placeholder="Search trainer name or specialization..."
                placeholderTextColor="#6B7280"
                className="flex-1 py-3 font-inter text-sm text-text-primary"
              />
              {search !== "" && (
                <TouchableOpacity
                  onPress={() => setSearch("")}
                  hitSlop={8}
                >
                  <Ionicons
                    name="close-circle"
                    size={18}
                    color="#B8BDC7"
                  />
                </TouchableOpacity>
              )}
            </View>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerClassName="gap-2 px-4"
          >
            {SPECIALIZATION_OPTIONS.map((opt) => {
              const active = selectedSpec === opt.value
              return (
                <TouchableOpacity
                  key={opt.value}
                  activeOpacity={0.8}
                  onPress={() => {
                    setSelectedSpec(opt.value)
                    if (opt.value !== "ALL") setSearch("")
                  }}
                  className={`rounded-full border px-4 py-2 ${active ? "border-primary bg-primary" : "border-border bg-surface"}`}
                >
                  <Text className={`font-inter text-xs font-semibold ${active ? "text-white" : "text-text-secondary"}`}>{opt.label}</Text>
                </TouchableOpacity>
              )
            })}
          </ScrollView>
        </View>

        <View className="gap-5 px-4 pt-2">
          {/* ================= BENEFIT BANNER ================= */}
          <View className="overflow-hidden rounded-2xl border border-primary/20">
            <LinearGradient
              colors={["#3A1C0E", "#1A1D24"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View className="flex-row items-start gap-4 p-4">
                <View className="mt-1 h-10 w-10 items-center justify-center rounded-full bg-primary/20">
                  <MaterialCommunityIcons
                    name="medal-outline"
                    size={20}
                    color="#FF6B00"
                  />
                </View>
                <View className="flex-1">
                  <Text className="mb-1 font-inter text-xs font-bold tracking-widest text-text-primary">PERSONAL TRAINER • Pro Tier</Text>
                  <Text className="font-inter text-xs leading-4 text-text-secondary">
                    Browse our certified trainers,{" "}
                    <Text className="font-inter text-xs font-bold text-text-primary">choose your preferred coach</Text>, and book your
                    1-on-1 workout session in just a few taps.
                  </Text>
                </View>
              </View>
            </LinearGradient>
          </View>

          {/* ================= TRAINER LIST ================= */}
          <View className="gap-5">
            {trainers.length === 0 ? (
              <View className="items-center gap-2 py-10">
                <Ionicons
                  name="search-outline"
                  size={32}
                  color="#B8BDC7"
                />
                <Text className="font-inter text-sm text-text-secondary">No trainers found</Text>
              </View>
            ) : (
              trainers.map((trainer) => (
                <TrainerCard
                  key={trainer.id}
                  data={trainer}
                />
              ))
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
