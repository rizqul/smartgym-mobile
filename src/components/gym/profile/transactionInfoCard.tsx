import { TransactionInfoRow } from "@/components/gym/payment/transactionInfoRow"
import { TransactionsResponse } from "@/type/Transaction.type"
import { formatDateTime } from "@/utils/FormaterHelper"
import React from "react"
import { Text, View } from "react-native"

type Props = {
  data: TransactionsResponse
  statusLabel: string
  statusTextColor: string
}

export function TransactionInfoCard({ data, statusLabel, statusTextColor }: Props) {
  return (
    <View className="w-full rounded-2xl border border-border/50 bg-card p-5">
      <Text className="mb-4 font-inter text-sm font-bold text-text-primary">Transaction information</Text>

      <View className="gap-3">
        <TransactionInfoRow
          label="Transaction ID"
          value={data.orderId}
        />
        <TransactionInfoRow
          label="Transaction date"
          value={formatDateTime(data.createdAt)}
        />
        {data.paidAt ? (
          <TransactionInfoRow
            label="Paid date"
            value={formatDateTime(data.paidAt)}
          />
        ) : null}
        <TransactionInfoRow
          label="Payment method"
          value={data.paymentType ? String(data.paymentType) : "-"}
        />
        <TransactionInfoRow
          label="Status"
          value={statusLabel}
          valueClassName={statusTextColor}
        />
      </View>
    </View>
  )
}
