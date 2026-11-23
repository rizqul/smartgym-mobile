import { ImageSourcePropType } from "react-native"

export type PaymentMethodId = "OTHER_QRIS" | "bank" | "GOPAY" | "DANA" | "SHOPEEPAY"
export type BankId = "BCA_VA" | "BNI_VA" | "BSI_VA" | "BRI_VA" | "ECHANNEL" | "SEABANK_VA"

export type PaymentMethod = {
  id: PaymentMethodId
  tile: ImageSourcePropType
  title: string
  description: string
}

export type BankOption = {
  id: BankId
  name: string
  image: ImageSourcePropType
}

export type PaymentSummary = {
  planName: string
  price: string
  duration: string
  total: string
}

export type PaymentSectionProps = {
  summary: PaymentSummary
  selectedMethod?: PaymentMethodId
  onSelectMethod?: (id: PaymentMethodId) => void
  selectedBank?: BankId
  onSelectBank?: (id: BankId) => void
  label: string
}
