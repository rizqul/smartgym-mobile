import { CheckinResponse, MyCheckinRequest, MyCheckinResponse, SummaryCheckin } from "@/type/checkin.type"
import api from "./api"

export const scanQr = async (code: string): Promise<CheckinResponse> => {
  try {
    const res = await api.post("/member/attendance/check-in", { token: code })
    return res.data.data
  } catch (err: any) {
    throw err
  }
}
export const checkOut = async (): Promise<CheckinResponse> => {
  try {
    const res = await api.post("/member/attendance/check-out")
    return res.data.data
  } catch (err: any) {
    throw err
  }
}
export const getMyCheckin = async ({ page, size, status }: MyCheckinRequest): Promise<MyCheckinResponse> => {
  try {
    const res = await api.get("/member/attendance", {
      params: {
        page,
        size,
        status
      }
    })
    return res.data
  } catch (err: any) {
    throw err
  }
}

export const getActiveCheckin = async (): Promise<CheckinResponse> => {
  try {
    const res = await api.get("/member/attendance/status")
    return res.data.data
  } catch (error: any) {
    throw error
  }
}

export const getSummaryCheckin = async (): Promise<SummaryCheckin> => {
  try {
    const res = await api.get("/member/attendance/summary")
    return res.data.data
  } catch (error: any) {
    throw error
  }
}
