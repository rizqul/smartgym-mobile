import api from "./api"

export const updateProfile = async (name: string, phoneNumber: string, imageUrl: string) => {
  const response = await api.post("/user/profile", { name, phoneNumber, imageUrl })
  console.log(response)
  return response.data
}
