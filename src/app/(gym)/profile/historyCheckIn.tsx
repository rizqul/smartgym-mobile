import CardHistoryCheckin from "@/components/gym/profile/cardHistoryCheckin"
import HeaderNavigation from "@/components/gym/templates/headerNavigation"
import { getMyCheckin } from "@/service/scan.service"
import { CheckinResponse } from "@/type/checkin.type"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import React, { useCallback, useEffect, useState } from "react"
import { ActivityIndicator, FlatList, StatusBar, Text, View } from "react-native"
import { ALERT_TYPE, Toast } from "react-native-alert-notification"
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
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: "Failed",
        textBody: "Failed to retrieve check-in history"
      })
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

  return (
    <SafeAreaView className="flex-1 bg-background">
      <StatusBar barStyle="light-content" />

      {/* HEADER */}
      <HeaderNavigation label="Riwayat Masuk" />

      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <CardHistoryCheckin item={item} />}
        showsVerticalScrollIndicator={false}
        className="px-5 pb-4"
        ListHeaderComponent={
          <View className="mb-6 flex-row items-center justify-between rounded-2xl border border-border bg-card p-5">
            <View>
              <Text className="mb-1 text-xs font-medium text-text-secondary">Total Kunjungan</Text>
              <Text className="text-2xl font-bold text-text-primary">
                {totalData} <Text className="text-sm font-normal text-text-secondary">Sesi</Text>
              </Text>
            </View>
            <View className="h-12 w-12 items-center justify-center rounded-full bg-primary/20">
              <MaterialCommunityIcons
                name="calendar-check"
                size={24}
                color="#FF6B00"
              />
            </View>
          </View>
        }

        ListHeaderComponentStyle={{ marginBottom: 4 }}

        ListEmptyComponent={
          isLoading ? (
            <View className="items-center justify-center py-20">
              <ActivityIndicator
                size="large"
                color="#FF6B00"
              />
              <Text className="mt-4 text-sm text-text-secondary">Memuat riwayat...</Text>
            </View>
          ) : (
            <View className="items-center justify-center py-20 opacity-50">
              <MaterialCommunityIcons
                name="calendar-blank-outline"
                size={48}
                color="#B8BDC7"
                className="mb-4"
              />
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
            <View className="items-center py-4">
              <ActivityIndicator
                size="small"
                color="#FF6B00"
              />
            </View>
          ) : (
            <></>
          )
        }
      />
    </SafeAreaView>
  )
}
