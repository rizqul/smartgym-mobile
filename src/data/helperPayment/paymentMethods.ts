import { PaymentMethod } from "@/type/payment.type"

export const PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: "OTHER_QRIS",
    tile: require("../../../assets/images/qris.jpeg"),
    title: "QRIS",
    description: "Scan dengan aplikasi bank atau e-wallet"
  },
  {
    id: "bank",
    tile: require("../../../assets/images/bank.jpg"),
    title: "Transfer bank / Virtual Account",
    description: "BNI, BSI, BRI, dan SeaBank"
  },
  {
    id: "GOPAY",
    tile: require("../../../assets/images/gopay.jpg"),
    title: "GOPAY",
    description: "Bayar instan menggunakan saldo GoPay atau QRIS"
  },
  {
    id: "DANA",
    tile: require("../../../assets/images/dana.jpg"),
    title: "DANA",
    description: "Pembayaran cepat dan mudah lewat dompet digital DANA"
  },
  {
    id: "SHOPEEPAY",
    tile: require("../../../assets/images/shopeepay.png"),
    title: "SHOPEEPAY",
    description: "Bayar praktis langsung menggunakan saldo ShopeePay"
  }
]
