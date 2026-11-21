import { CheckinResponse } from "@/type/checkin.type"
import api from "./api"

export const scanQr = async (code: string): Promise<CheckinResponse> => {
  try {
    const res = await api.post<CheckinResponse>("/member/checkins", { token: code })
    return res.data
  } catch (err: any) {
    console.log(err.response?.data)
    throw err
  }
}
