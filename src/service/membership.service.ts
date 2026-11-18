import { TypePackage } from "@/type/membership.type"
import api from "./api"

// export const createMembership = async ({transactionId, packageId}) => {
//   const response = await api.post("member/membership", )
// }

export const getAllMemberships = async (): Promise<TypePackage> => {
  const response = await api.get("member/membership")
  return response.data.data
}
