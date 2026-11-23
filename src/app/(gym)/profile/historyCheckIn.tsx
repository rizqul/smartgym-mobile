import HeaderNavigation from "@/components/gym/templates/headerNavigation"
import { getMyCheckin } from "@/service/scan.service"
import { CheckinResponse } from "@/type/checkin.type"
import { formatDate, FormatTime } from "@/utils/FormaterHelper"
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import React, { useCallback, useEffect, useState } from "react"
import { ActivityIndicator, FlatList, StatusBar, Text, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

export default function HistoryCheckIn() {
  const router = useRouter()

  const [data, setData] = useState<CheckinResponse[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [totalData, setTotalData] = useState(0)

  const fetchData = async (currentPage: number, isRefresh = false) => {
    if (currentPage === 1) {
      if (!isRefresh) setIsLoading(true)
    } else {
      setIsLoadingMore(true)
    }

    try {
      const res = await getMyCheckin({ page: currentPage, size: 10 })

      if (currentPage === 1) {
        setData(res.data)
      } else {
        setData((prev) => [...prev, ...res.data])
      }

      setTotalData(res.paginate.totalData)
      setHasMore(res.paginate.nextUrl !== null)
      setPage(res.paginate.currentPage)
    } catch (error) {
      console.error("Gagal mengambil riwayat check-in:", error)
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
      setIsLoadingMore(false)
    }
  }

  useEffect(() => {
    void fetchData(1)
  }, [])

  // Handler untuk refresh
  const handleRefresh = useCallback(() => {
    setIsRefreshing(true)
    void fetchData(1, true)
  }, [])

  const handleLoadMore = useCallback(() => {
    if (!isLoadingMore && hasMore && !isLoading) {
      void fetchData(page + 1)
    }
  }, [isLoadingMore, hasMore, isLoading, page])


  const calculateDuration = (inAt: string, outAt: string | null) => {
    if (!outAt) return "Sedang Latihan"

    const start = new Date(inAt).getTime()
    const end = new Date(outAt).getTime()
    const diffMs = end - start

    const diffMins = Math.floor(diffMs / 60000)
    const hours = Math.floor(diffMins / 60)
    const mins = diffMins % 60

    if (hours > 0) return `${hours}j ${mins}m`
    return `${mins}m`
  }

  const renderItem = ({ item }: { item: CheckinResponse }) => {
    const time = FormatTime(item.checkInAt)
    const isDenied = item.status === "DENIED"

    return (
      <View className="mb-4 flex-row items-center gap-4 rounded-xl border border-border/50 bg-surface p-4">
        {/* Icon / Tanggal */}
        <View className="h-12 w-12 items-center justify-center rounded-xl border border-border bg-background">
          <Text className={`text-xs font-bold ${isDenied ? 'text-danger' : 'text-primary'}`}>{time.hour}</Text>
          <Text className="text-[10px] text-text-secondary">{time.minute}</Text>
        </View>

        {/* Detail */}
        <View className="flex-1">
          <Text className="mb-0.5 text-sm font-bold text-text-primary">
            SmartGym Central Base
          </Text>
          <Text className="mb-1.5 text-xs text-text-secondary">
            {formatDate(item.checkInAt)}
          </Text>
          <View className="flex-row items-center gap-2">
            {/* Status Badge */}
            <View className={`flex-row items-center gap-1 rounded px-2 py-0.5 ${isDenied ? 'bg-danger/15' : 'bg-success/15'}`}>
              <View className={`h-1.5 w-1.5 rounded-full ${isDenied ? 'bg-danger' : 'bg-success'}`} />
              <Text className={`text-[10px] font-bold ${isDenied ? 'text-danger' : 'text-success'}`}>
                {isDenied ? "Ditolak" : "Berhasil"}
              </Text>
            </View>

            {/* Duration / Reason */}
            {isDenied ? (
              <Text className="text-[10px] text-danger" numberOfLines={1}>
                • {item.denialReason || "Akses Ditolak"}
              </Text>
            ) : (
              <Text className="text-[10px] text-text-secondary">
                • Durasi: {calculateDuration(item.checkInAt, item.checkOutAt)}
              </Text>
            )}
          </View>
        </View>

        {/* Chevron */}
        <Ionicons name="chevron-forward" size={16} color="#B8BDC7" />
      </View>
    )
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <StatusBar barStyle="light-content" />

      {/* HEADER */}
      <HeaderNavigation label="Riwayat Masuk" />

      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 24, paddingBottom: 40 }}
        ListHeaderComponent={
          <View className="mb-6 flex-row items-center justify-between rounded-2xl border border-border bg-card p-5">
            <View>
              <Text className="mb-1 text-xs font-medium text-text-secondary">Total Kunjungan</Text>
              <Text className="text-2xl font-bold text-text-primary">
                {totalData} <Text className="text-sm font-normal text-text-secondary">Sesi</Text>
              </Text>
            </View>
            <View className="h-12 w-12 items-center justify-center rounded-full bg-primary/20">
              <MaterialCommunityIcons name="calendar-check" size={24} color="#FF6B00" />
            </View>
          </View>
        }

        ListHeaderComponentStyle={{ marginBottom: 4 }}

        ListEmptyComponent={
          isLoading ? (
            <View className="py-20 items-center justify-center">
              <ActivityIndicator size="large" color="#FF6B00" />
              <Text className="mt-4 text-sm text-text-secondary">Memuat riwayat...</Text>
            </View>
          ) : (
            <View className="py-20 items-center justify-center opacity-50">
              <MaterialCommunityIcons name="calendar-blank-outline" size={48} color="#B8BDC7" className="mb-4" />
              <Text className="text-sm text-text-secondary">Belum ada riwayat kunjungan.</Text>
            </View>
          )
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        onRefresh={handleRefresh}
        refreshing={isRefreshing}
        ListFooterComponent={
          isLoadingMore ? (
            <View className="py-4 items-center">
              <ActivityIndicator size="small" color="#FF6B00" />
            </View>
          ) : <></>
        }

      />
    </SafeAreaView>
  )
}