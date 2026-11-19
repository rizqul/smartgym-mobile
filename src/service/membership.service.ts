import { TypePackage } from "@/type/membership.type"
import api from "./api"

export const buyMembership = async (transactionId: string, packageId: string) => {
  try {
    const res = await api.post("/member/membership", { transactionId, packageId })
    const paymentUrl = res.data.data
    return paymentUrl
  } catch (err: any) {
    console.log(err.response?.data)
    throw err
  }
}

export const getAllMemberships = async (): Promise<TypePackage> => {
  const response = await api.get("member/membership")
  return response.data.data
}
