import { TransactionActionButton } from "@/components/gym/payment/transactionActionButton"
import React from "react"
import { Text, TouchableOpacity, View } from "react-native"

type Props = {
  isSuccess: boolean
  isPending: boolean
  canContinue: boolean
  canCheck: boolean
  checking: boolean
  cancelling: boolean
  onPay: () => void
  onCheck: () => void
  onCancel: () => void
  onBack: () => void
}

export function TransactionActions({
  isSuccess,
  isPending,
  canContinue,
  canCheck,
  checking,
  cancelling,
  onPay,
  onCheck,
  onCancel,
  onBack
}: Props) {
  return (
    <View className="w-full gap-3">
      {isSuccess ? (
        <TouchableOpacity className="w-full items-center justify-center rounded-xl bg-primary py-4">
          <Text className="font-inter text-sm font-bold text-[#111317]">View Digital Pass</Text>
        </TouchableOpacity>
      ) : null}

      {canContinue ? (
        <TransactionActionButton
          label="Continue Payment"
          variant="secondary"
          onPress={onPay}
          disabled={cancelling}
        />
      ) : null}

      {canCheck ? (
        <TransactionActionButton
          label="Check Status"
          variant="outline"
          onPress={onCheck}
          loading={checking}
          disabled={cancelling}
        />
      ) : null}

      {isPending ? (
        <TransactionActionButton
          label="Cancel Transaction"
          variant="danger"
          onPress={onCancel}
          loading={cancelling}
          disabled={checking}
        />
      ) : (
        <TransactionActionButton
          label="Back to transaction history"
          variant="outline"
          onPress={onBack}
        />
      )}
    </View>
  )
}
