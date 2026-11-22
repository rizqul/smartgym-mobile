import { TransactionCard } from "@/components/gym/profile/TransactionCard"
import HeaderNavigation from "@/components/gym/templates/headerNavigation"
import { fetchTransactions } from "@/store/slice/transactionSlice"
import { AppDispatch, RootState } from "@/store/store"
import { Ionicons } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import React, { useEffect } from "react"
import { ScrollView, StatusBar, Text, TouchableOpacity, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useDispatch, useSelector } from "react-redux"

export default function TransactionHistory() {
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()
  const { result } = useSelector((state: RootState) => state.transaction)

  useEffect(() => {
    dispatch(fetchTransactions())
  }, [])

  const transaction = result?.data

  // map by date
  // const groupedTransactions = DUMMYTRANSACTIONS.reduce(
  //   (acc, curr) => {
  //     const date = new Date(curr.created_at)
  //     const monthYear = date.toLocaleDateString("id-ID", { month: "long", year: "numeric" }).toUpperCase()

  //     if (!acc[monthYear]) {
  //       acc[monthYear] = []
  //     }
  //     acc[monthYear].push(curr)
  //     return acc
  //   },
  //   {} as Record<string, TransactionData[]>
  // )

  const handleShowDetail = (id: string) => {
    router.push({ pathname: "/(gym)/profile/detailHistory", params: { id } })
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <StatusBar barStyle="light-content" />

      {/* HEADER */}
      <HeaderNavigation label="Riwayat Transaksi" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="px-5 pt-4 gap-3"
      >
        {/* TITLE SECTION */}
        <View>
          <Text className="mb-1 text-2xl font-bold text-text-primary">Riwayat pembayaran</Text>
          <Text className="text-xs text-text-secondary">Booking trainer dan membership dalam satu tempat.</Text>
        </View>

        {/* FILTER TABS */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerClassName="gap-2"
        >
          <TouchableOpacity className="rounded-lg bg-primary px-4 py-2">
            <Text className="text-xs font-bold text-white">Semua</Text>
          </TouchableOpacity>
          <TouchableOpacity className="rounded-lg border border-border/50 bg-surface px-4 py-2">
            <Text className="text-xs font-semibold text-text-secondary">Booking Trainer</Text>
          </TouchableOpacity>
          <TouchableOpacity className="rounded-lg border border-border/50 bg-surface px-4 py-2">
            <Text className="text-xs font-semibold text-text-secondary">Membership</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* DROPDOWN FILTERS (MOCKUP) */}
        <View className="flex-row gap-3">
          <TouchableOpacity className="flex-1 flex-row items-center justify-between rounded-xl border border-border/50 bg-surface px-3 py-2.5">
            <Text className="text-xs font-semibold text-text-primary">Semua periode</Text>
            <Ionicons
              name="chevron-down"
              size={14}
              color="#B8BDC7"
            />
          </TouchableOpacity>
          <TouchableOpacity className="flex-1 flex-row items-center justify-between rounded-xl border border-border/50 bg-surface px-3 py-2.5">
            <Text className="text-xs font-semibold text-text-primary">Semua status</Text>
            <Ionicons
              name="chevron-down"
              size={14}
              color="#B8BDC7"
            />
          </TouchableOpacity>
        </View>

        {/* TRANSACTION LIST (BERDASARKAN HASIL GROUPING) */}
        <View className="gap-4">
          {/* {Object.entries(groupedTransactions).map(([monthYear, items], index) => (
            <View
              key={index}
              className="mb-6 gap-3"
            >
              {/* Group Header */}
          {/* <View className="flex-row items-center justify-between">
                <Text className="text-[10px] font-bold uppercase tracking-widest text-text-secondary">{monthYear}</Text>
                <Text className="text-[10px] text-text-secondary">{items.length} transaksi</Text>
              </View> */}

          {/* Group Items */}
          {/* {items.map((item) => (
                <TransactionCard
                  key={item.id}
                  item={item}
                  showDetail={() => {
                    handleShowDetail(String(item.id))
                  }}
                />
              ))}
            </View> */}
          {/* ))}} */}
          {transaction?.map((item) => {
            return (
              <TransactionCard
                key={item.id}
                item={item}
                showDetail={() => {
                  handleShowDetail(item.id)
                }}
              />
            )
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
