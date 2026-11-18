import { TransactionData } from "@/utils/types/Transaction.type"

export const DUMMYTRANSACTIONS: TransactionData[] = [
  {
    id: 101,
    member_id: 1,
    type: "PT_BOOKING",
    amount: 0, // Rp 0 karena voucher
    status: "PAID",
    midtrans_order_id: "SG-PT-280524-09",
    payment_method: "QRIS",
    paid_at: "2024-05-28 08:00:00",
    created_at: "2024-05-24 10:00:00",
    relation_data: {
      title: "Coach Rio Pratama, CSCS",
      description: "1 sesi • 28 Mei 2024, 08.00-09.00 WIB",
      extra_info: "Voucher PT Gratis"
    }
  },
  {
    id: 102,
    member_id: 1,
    type: "MEMBERSHIP",
    amount: 5017100,
    status: "PENDING", // Belum dibayar
    midtrans_order_id: "SG-MB-994821",
    payment_method: null,
    paid_at: null,
    created_at: "2024-05-24 09:30:00",
    relation_data: {
      title: "SmartGym Pro Athlete",
      description: "Perpanjangan • 12 bulan",
      extra_info: "Menunggu Pembayaran"
    }
  },
  {
    id: 103,
    member_id: 1,
    type: "PT_BOOKING",
    amount: 0,
    status: "PAID",
    midtrans_order_id: "SG-PT-140524-02",
    payment_method: "QRIS",
    paid_at: "2024-05-14 09:00:00",
    created_at: "2024-05-10 14:20:00",
    relation_data: {
      title: "Coach Rio Pratama, CSCS",
      description: "1 sesi • Functional Core & Lift",
      extra_info: "Voucher PT Gratis"
    }
  },
  {
    id: 201,
    member_id: 1,
    type: "MEMBERSHIP",
    amount: 5017100,
    status: "PAID",
    midtrans_order_id: "SG-MB-230524-01",
    payment_method: "QRIS",
    paid_at: "2023-05-24 11:00:00",
    created_at: "2023-05-24 10:45:00",
    relation_data: {
      title: "SmartGym Pro Athlete",
      description: "Membership tahunan • 12 bulan",
      extra_info: ""
    }
  }
]
