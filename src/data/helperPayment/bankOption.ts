import { BankOption } from "@/type/payment.type"

export const BANK_OPTIONS: BankOption[] = [
  { id: "BCA_VA", name: "BCA", image: require("../../../assets/images/bca.jpg") },
  { id: "BNI_VA", name: "BNI", image: require("../../../assets/images/bni.jpg") },
  { id: "BSI_VA", name: "BSI", image: require("../../../assets/images/bsi.png") },
  { id: "BRI_VA", name: "BRI", image: require("../../../assets/images/bri.png") },
  { id: "SEABANK_VA", name: "SeaBank", image: require("../../../assets/images/seabank.jpg") },
  { id: "ECHANNEL", name: "MANDIRI", image: require("../../../assets/images/mandiri.png") }
]
