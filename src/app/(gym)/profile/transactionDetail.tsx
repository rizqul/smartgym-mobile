import { TransactionActionButton } from "@/components/gym/payment/transactionActionButton"
import { TransactionActions } from "@/components/gym/profile/transactionActions"
import { TransactionCountdownCard } from "@/components/gym/profile/transactionCountdownCard"
import { TransactionHero } from "@/components/gym/profile/transactionHero"
import { TransactionInfoCard } from "@/components/gym/profile/transactionInfoCard"
import { TransactionPaymentBreakdown } from "@/components/gym/profile/transactionPaymentBreakdown"
import { TransactionSummaryCard } from "@/components/gym/profile/transactionSummaryCard"
import HeaderNavigation from "@/components/gym/templates/headerNavigation"
import { HERO } from "@/data/helperTransaction/transactionHero"

import { useTransactionDetail } from "@/hooks/useTransactionDetail"
import { getStatusUI } from "@/utils/transactionHelper"
import { Ionicons } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import React from "react"
import { ActivityIndicator, ScrollView, StatusBar, Text, TouchableOpacity, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

export default function TransactionDetail() {
  const router = useRouter()

  const {
    data,
    loading,
    error,
    checking,
    cancelling,
    isPending,
    remaining,
    isTimeUp,
    retry,
    handleCheckStatus,
    handlePay,
    handleCancel,
    downloading,
    handleDownload
  } = useTransactionDetail()

  const handleBackToHistory = () => {
    if (router.canDismiss()) {
      router.dismissAll()
    }
    router.replace("/(gym)/profile/historyTransaction")
  }

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-background">
        <StatusBar barStyle="light-content" />
        <HeaderNavigation label="Transaction Details" />
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color="#FF6B00" />
        </View>
      </SafeAreaView>
    )
  }

  if (!data) {
    return (
      <SafeAreaView className="flex-1 bg-background">
        <StatusBar barStyle="light-content" />
        <View className="w-full flex-row items-center gap-4 border-b border-border/40 px-3 py-3">
          <TouchableOpacity
            onPress={handleBackToHistory}
            className="h-10 w-10 items-center justify-center rounded-xl border border-border/50 bg-surface"
          >
            <Ionicons
              name="chevron-back"
              size={20}
              color="white"
            />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-text-primary">Transaction Details</Text>
        </View>
        <View className="flex-1 items-center justify-center gap-4 px-8">
          <Text className="text-center font-inter text-sm text-text-secondary">{error ?? "Transaction not found."}</Text>
          <TransactionActionButton
            label="Try again"
            variant="outline"
            onPress={retry}
          />
        </View>
      </SafeAreaView>
    )
  }

  const hero = HERO[data.status]
  const statusUI = getStatusUI(data.status)
  const isSuccess = data.status === "SUCCESS"
  const typeLabel = data.type === "PT_BOOKING" ? "Trainer Booking" : "Membership"
  const canContinue = isPending && !isTimeUp
  const canCheck = isPending || data.status === "PROCESS" || data.status === "CHALLENGE"

  return (
    <SafeAreaView className="flex-1 bg-background">
      <StatusBar barStyle="light-content" />

      <HeaderNavigation label="Transaction Details" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="px-5 pt-8 pb-10 gap-4 items-center"
      >
        <TransactionHero hero={hero} />

        {isPending && data.expiredAt ? (
          <TransactionCountdownCard
            expiredAt={data.expiredAt}
            remaining={remaining}
            isTimeUp={isTimeUp}
          />
        ) : null}

        <TransactionSummaryCard
          typeLabel={typeLabel}
          statusLabel={statusUI.label}
          statusTextColor={statusUI.textColor}
          name={data.name}
          amount={data.amount}
        />

        <TransactionInfoCard
          data={data}
          statusLabel={statusUI.label}
          statusTextColor={statusUI.textColor}
        />

        <TransactionPaymentBreakdown amount={data.amount} />

        <TransactionActions
          isSuccess={isSuccess}
          isPending={isPending}
          canContinue={canContinue}
          canCheck={canCheck}
          checking={checking}
          cancelling={cancelling}
          onPay={handlePay}
          onCheck={() => handleCheckStatus()}
          downloading={downloading}
          onCancel={handleCancel}
          onDownload={handleDownload}
          onBack={handleBackToHistory}
        />
      </ScrollView>
    </SafeAreaView>
  )
}
