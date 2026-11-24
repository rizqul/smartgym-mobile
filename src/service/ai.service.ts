import { AiWorkoutRequest } from "@/type/ai.type"
import api from "./api"

export const generateWorkoutPlan = async (payload: AiWorkoutRequest) => {
  const res = await api.post("/member/ai/generate", payload, {
    timeout: 60000
  })
  return res.data.data
}
