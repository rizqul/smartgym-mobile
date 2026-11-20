import api from "./api"

export interface ReactNativeFile {
  uri: string
  name: string
  type: string
}

export const updateProfile = async (name: string, phoneNumber: string, photo?: ReactNativeFile | null) => {
  const formData = new FormData()

  formData.append("name", name)
  formData.append("phoneNumber", phoneNumber)

  if (photo) {
    formData.append("photo", photo as unknown as Blob)
  }

  const response = await api.put("/user/profile", formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  })

  return response.data
}

export const changePassword = async (oldPassword: string, newPassword: string) => {
  const response = await api.put("/user/password", { oldPassword, newPassword })
  console.log(response)
  return response.data
}

export const getProfile = async () => {
  const response = await api.get("/user")
  return response.data
}
