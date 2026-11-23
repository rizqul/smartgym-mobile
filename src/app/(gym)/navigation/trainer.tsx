import { TrainerCard } from "@/components/gym/trainer/TrainerCard"
import { fetchTrainers } from "@/store/slice/trainerSlice"
import { AppDispatch, RootState } from "@/store/store"
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"
import { useRouter } from "expo-router"
import React, { useEffect, useMemo, useState } from "react"
import { ScrollView, StatusBar, Text, TextInput, TouchableOpacity, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useDispatch, useSelector } from "react-redux"

const SPECIALIZATION_OPTIONS = [
  { value: "ALL", label: "Semua" },
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

type SortKey = "none" | "experience" | "price"
type SortDir = "asc" | "desc"

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: "none", label: "Standar" },
  { key: "experience", label: "Pengalaman" },
  { key: "price", label: "Harga" }
]

export default function TrainerScreen() {
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()
  const { result } = useSelector((state: RootState) => state.trainer)
  const [search, setSearch] = useState<string>("")
  const [debouncedSearch, setDebouncedSearch] = useState<string>(search)
  const [selectedSpec, setSelectedSpec] = useState<string>("ALL")
  const [sortKey, setSortKey] = useState<SortKey>("none")
  const [sortDir, setSortDir] = useState<SortDir>("desc")
  const [searchFocused, setSearchFocused] = useState(false)

  const activeFilterCount = (selectedSpec !== "ALL" ? 1 : 0) + (sortKey !== "none" ? 1 : 0)

  const resetFilters = () => {
    setSelectedSpec("ALL")
    setSortKey("none")
    setSortDir("desc")
  }

  useEffect(() => {
    dispatch(fetchTrainers())
  }, [])

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearch(search)
    }, 500)

    return () => {
      clearTimeout(timeoutId)
    }
  }, [search])

  const handleSort = (key: SortKey) => {
    if (key === "none") {
      setSortKey("none")
      return
    }
    if (key === sortKey) {
      setSortDir((prev) => (prev === "asc" ? "desc" : "asc"))
    } else {
      setSortKey(key)
      setSortDir(key === "experience" ? "desc" : "asc")
    }
  }

  const trainers = useMemo(() => {
    let list = [...(result ?? [])]

    const keyword = search.trim() === "" ? "" : debouncedSearch.trim().toLowerCase()
    if (keyword) {
      list = list.filter(
        (t) => t.name.toLowerCase().includes(keyword) || String(t.specialization).toLowerCase().replace(/_/g, " ").includes(keyword)
      )
    }

    if (selectedSpec !== "ALL") {
      list = list.filter((t) => t.specialization === selectedSpec)
    }

    if (sortKey !== "none") {
      const dir = sortDir === "asc" ? 1 : -1
      const getValue = (t: (typeof list)[number]) => (sortKey === "price" ? Number(t.rate) : Number(t.experience))
      list.sort((a, b) => (getValue(a) - getValue(b)) * dir)
    }

    return list
  }, [result, search, debouncedSearch, selectedSpec, sortKey, sortDir])

  return (
    <SafeAreaView className="flex-1 bg-background">
      <StatusBar barStyle="light-content" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="pb-10"
        keyboardShouldPersistTaps="handled"
        stickyHeaderIndices={[0]}
      >
        {/* ================= STICKY HEADER: SEARCH ================= */}
        <View className="bg-background px-4 pb-3 pt-4">
          <View
            className={`flex-row items-center gap-2 rounded-2xl border bg-surface px-4 py-1 ${
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
              placeholder="Cari nama trainer, spesialisasi..."
              placeholderTextColor="#6B7280"
              className="flex-1 py-3 text-sm text-text-primary"
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

        <View className="gap-5 px-4 pt-2">
          {/* ================= FILTER & SORT CONTAINER ================= */}
          <View className="gap-4 rounded-2xl border border-border bg-surface p-4">
            {/* Header wadah */}
            <View className="flex-row items-center">
              <View className="flex-row items-center gap-2">
                <Ionicons
                  name="options-outline"
                  size={18}
                  color="#FFB693"
                />
                <Text className="text-sm font-bold text-text-primary">Filter & Urutkan</Text>
              </View>
            </View>

            {/* Spesialisasi */}
            <View className="gap-2">
              <Text className="text-[10px] font-semibold uppercase tracking-wide text-text-subdued">Spesialisasi</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                className="-mx-4"
                contentContainerClassName="gap-2 px-4"
                keyboardShouldPersistTaps="handled"
              >
                {SPECIALIZATION_OPTIONS.map((opt) => {
                  const active = selectedSpec === opt.value
                  return (
                    <TouchableOpacity
                      key={opt.value}
                      activeOpacity={0.8}
                      onPress={() => setSelectedSpec(opt.value)}
                      className={`rounded-full border px-4 py-2 ${active ? "border-primary bg-primary" : "border-border bg-card"}`}
                    >
                      <Text className={`text-xs ${active ? "font-bold text-background" : "font-semibold text-text-body"}`}>
                        {opt.label}
                      </Text>
                    </TouchableOpacity>
                  )
                })}
              </ScrollView>
            </View>

            <View className="h-px bg-border" />

            {/* Urutkan */}
            <View className="gap-2">
              <Text className="text-[10px] font-semibold uppercase tracking-wide text-text-subdued">Urutkan</Text>
              <View className="flex-row gap-1 rounded-xl border border-border bg-card p-1">
                {SORT_OPTIONS.map((opt) => {
                  const active = sortKey === opt.key
                  return (
                    <TouchableOpacity
                      key={opt.key}
                      activeOpacity={0.8}
                      onPress={() => handleSort(opt.key)}
                      className={`flex-1 flex-row items-center justify-center gap-1 rounded-lg py-2.5 ${
                        active ? "border border-primary/40 bg-primary/15" : "border border-transparent"
                      }`}
                    >
                      <Text className={`text-xs ${active ? "font-bold text-primary" : "font-semibold text-text-secondary"}`}>
                        {opt.label}
                      </Text>
                      {active && opt.key !== "none" && (
                        <Ionicons
                          name={sortDir === "asc" ? "arrow-up" : "arrow-down"}
                          size={12}
                          color="#FF6B00"
                        />
                      )}
                    </TouchableOpacity>
                  )
                })}
              </View>
            </View>
          </View>
          {/* ================= BENEFIT BANNER ================= */}
          <View className="overflow-hidden rounded-2xl border border-primary/20">
            <LinearGradient
              colors={["#3A1C0E", "#1A1D24"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View className="flex-row items-start gap-4 p-4 ">
                <View className="mt-1 h-10 w-10 items-center justify-center rounded-full bg-primary/20">
                  <MaterialCommunityIcons
                    name="medal-outline"
                    size={20}
                    color="#FF6B00"
                  />
                </View>
                <View className="flex-1">
                  <Text className="mb-1 text-[10px] font-bold tracking-widest text-text-primary">BENEFIT ANGGOTA • Pro Tier</Text>
                  <Text className="text-xs leading-4 text-text-secondary">
                    Paket SmartGym Pro kamu menyertakan <Text className="font-bold text-text-primary">4x Sesi PT Gratis</Text> tersisa!
                    Kupon otomatis diterapkan saat konfirmasi.
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
                <Text className="text-sm text-text-secondary">Trainer tidak ditemukan</Text>
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
