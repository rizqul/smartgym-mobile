import { TypePackage } from "@/type/membership.type"
import api from "./api"

export const buyMembership = async (packageId: string, paymentType:string) => {
  try {
    const res = await api.post("/member/membership/order", { packageId, paymentType })
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
