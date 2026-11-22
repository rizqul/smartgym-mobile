import { CheckinResponse } from "@/type/checkin.type"
import api from "./api"

export const scanQr = async (code: string): Promise<CheckinResponse> => {
  try {
    const res = await api.post("/member/checkins", { token: code })
    return res.data.data
  } catch (err: any) {
    console.log(err.response?.data)
    throw err
  }
}
export const checkOut = async (): Promise<CheckinResponse> => {
  try {
    const res = await api.post("/member/checkins/checkout")
    return res.data.data
  } catch (err: any) {
    console.log(err.response?.data)
    throw err
  }
}
