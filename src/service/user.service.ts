import api from "./api"

export const updateProfile = async (name: string, phoneNumber: string, imageUrl: string) => {
  const response = await api.post("/user/profile", { name, phoneNumber, imageUrl })
  console.log(response)
  return response.data
}

export const changePassword = async (oldPassword: string, newPassword: string) => {
  const response = await api.put("/user/password", { oldPassword, newPassword })
  console.log(response)
  return response.data
}
