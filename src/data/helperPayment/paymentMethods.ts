import { PaymentMethod } from "@/type/payment.type"

export const PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: "OTHER_QRIS",
    tile: require("../../../assets/images/qris.jpeg"),
    title: "QRIS",
    description: "Scan with a banking or e-wallet application"
  },
  {
    id: "bank",
    tile: require("../../../assets/images/bank.jpg"),
    title: "Transfer bank / Virtual Account",
    description: "BNI, BSI, BRI, MANDIRI, and Others"
  },
  {
    id: "GOPAY",
    tile: require("../../../assets/images/gopay.jpg"),
    title: "GOPAY",
    description: "Pay instantly using your GoPay balance or QRIS"
  },
  {
    id: "DANA",
    tile: require("../../../assets/images/dana.jpg"),
    title: "DANA",
    description: "Fast and easy payments using the DANA digital wallet"
  },
  {
    id: "SHOPEEPAY",
    tile: require("../../../assets/images/shopeepay.png"),
    title: "SHOPEEPAY",
    description: "Pay conveniently using your ShopeePay balance"
  }
]
