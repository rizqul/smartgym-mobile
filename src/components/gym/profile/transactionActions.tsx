import { TransactionActionButton } from "@/components/gym/payment/transactionActionButton"
import React from "react"
import { View } from "react-native"

type Props = {
  isSuccess: boolean
  isPending: boolean
  canContinue: boolean
  canCheck: boolean
  checking: boolean
  cancelling: boolean
  downloading: boolean
  onPay: () => void
  onCheck: () => void
  onCancel: () => void
  onDownload: () => void
  onBack: () => void
}

export function TransactionActions({
  isSuccess,
  isPending,
  canContinue,
  canCheck,
  checking,
  cancelling,
  downloading,
  onPay,
  onCheck,
  onCancel,
  onDownload,
  onBack
}: Props) {
  return (
    <View className="w-full gap-3">
      {isSuccess ? (
        <TransactionActionButton
          label="Download Receipt"
          variant="primary"
          onPress={onDownload}
          disabled={downloading}
        />
      ) : null}

      {canContinue ? (
        <TransactionActionButton
          label="Continue Payment"
          variant="primary"
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
