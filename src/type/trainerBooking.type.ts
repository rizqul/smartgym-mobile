import { Trainer, TrainerSlot } from "@/type/Trainer.type"
import { PaginationMeta, UserTransactionResponse } from "@/type/Transaction.type"

export interface TrainerBookingResponse {
  id: string
  member: UserTransactionResponse
  trainer: Trainer
  slot: TrainerSlot
}

export interface PaginationTrainerBookingResponse {
  data: TrainerBookingResponse[]
  pagination: PaginationMeta
}
