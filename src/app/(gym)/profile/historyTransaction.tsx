import { FilterSelect } from "@/components/gym/profile/filterSelect"
import { TransactionCard } from "@/components/gym/profile/transactionCard"
import HeaderNavigation from "@/components/gym/templates/headerNavigation"
import {
  DEFAULT_FILTER,
  SORT_OPTIONS,
  STATUS_OPTIONS,
  TYPE_OPTIONS,
  TransactionFilterState
} from "@/data/helperTransaction/transactionFilter"
import { fetchTransactions } from "@/store/slice/transactionSlice"
import { AppDispatch, RootState } from "@/store/store"
import { TransactionStatus, TransactionType } from "@/type/Transaction.type"
import { Ionicons } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import React, { useEffect, useState } from "react"
import { ActivityIndicator, FlatList, ScrollView, StatusBar, Text, TouchableOpacity, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useDispatch, useSelector } from "react-redux"

export default function TransactionHistory() {
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()
  const { result, isLoading } = useSelector((state: RootState) => state.transaction)
  const [filter, setFilter] = useState<TransactionFilterState>(DEFAULT_FILTER)
  const loading = isLoading && !result

  useEffect(() => {
    const sortOpt = SORT_OPTIONS.find((o) => o.value === filter.sort)

    dispatch(
      fetchTransactions({
        type: filter.type === "ALL" ? undefined : (filter.type as TransactionType),
        status: filter.status === "ALL" ? undefined : (filter.status as TransactionStatus),
        sortBy: sortOpt?.sortBy,
        direction: sortOpt?.direction,
        size: 50
      })
    )
  }, [filter.type, filter.status, filter.sort, dispatch])

  const transactions = result?.data ?? []

  const hasActiveFilter = filter.type !== "ALL" || filter.status !== "ALL"

  const update = <K extends keyof TransactionFilterState>(key: K, value: TransactionFilterState[K]) =>
    setFilter((prev) => ({ ...prev, [key]: value }))

  const handleShowDetail = (id: string) => {
    router.push({ pathname: "/(gym)/profile/transactionDetail", params: { id } })
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <StatusBar barStyle="light-content" />

      {/* HEADER */}
      <HeaderNavigation label="Transaction History" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="px-5 pt-4 pb-10 gap-3"
      >
        {/* TITLE SECTION */}
        <View>
          <Text className="mb-1 font-inter text-2xl font-bold text-text-primary">Payment history</Text>
          <Text className="font-inter text-sm text-text-secondary">Trainer bookings and memberships in one place.</Text>
        </View>

        {/* TYPE TABS */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerClassName="gap-2"
        >
          {TYPE_OPTIONS.map((opt) => {
            const active = filter.type === opt.value
            return (
              <TouchableOpacity
                key={opt.value}
                onPress={() => update("type", opt.value)}
                className={`rounded-lg px-4 py-2 ${active ? "bg-primary" : "border border-border/50 bg-surface"}`}
              >
                <Text className={`font-inter text-sm ${active ? "font-bold text-white" : "font-semibold text-text-secondary"}`}>
                  {opt.label}
                </Text>
              </TouchableOpacity>
            )
          })}
        </ScrollView>

        {/* PERIOD & STATUS FILTERS */}
        <View className="flex-row gap-3">
          <FilterSelect
            className="flex-1"
            title="Filter by status"
            value={filter.status}
            options={STATUS_OPTIONS}
            onChange={(v) => update("status", v)}
            isActive={filter.status !== "ALL"}
          />
          <FilterSelect
            className="flex-1"
            title="Sort by"
            icon="swap-vertical"
            value={filter.sort}
            options={SORT_OPTIONS}
            onChange={(v) => update("sort", v)}
          />
        </View>
        <Text className="font-inter text-xs text-text-secondary">{transactions.length} found</Text>

        {/* TRANSACTION LIST */}
        {loading ? (
          <ActivityIndicator
            size="large"
            color="#FF6B00"
            className="mt-10"
          />
        ) : (
          <FlatList
            data={transactions}
            keyExtractor={(item) => String(item.id)}
            scrollEnabled={false}
            ItemSeparatorComponent={() => <View className="h-4" />}
            renderItem={({ item }) => (
              <TransactionCard
                item={item}
                showDetail={() => handleShowDetail(item.orderId)}
              />
            )}
            ListEmptyComponent={
              <View className="items-center gap-2 py-16">
                <Ionicons
                  name="receipt-outline"
                  size={40}
                  color="#B8BDC7"
                />
                <Text className="font-inter text-base font-bold text-text-primary">No transactions found</Text>
                <Text className="text-center font-inter text-sm text-text-secondary">
                  {hasActiveFilter ? "Try changing or resetting your filters." : "Your transactions will appear here."}
                </Text>
              </View>
            }
          />
        )}
      </ScrollView>
    </SafeAreaView>
  )
}
