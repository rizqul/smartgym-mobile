import * as SecureStore from "expo-secure-store"
import api from "./api"

const USER_DATA_KEY = "user_profile"

export async function login(email: string, password: string) {
  const response = await api.post("auth/login", { email, password })
  const { data } = response.data

  const setCookieHeader = response.headers["set-cookie"]

  if (setCookieHeader) {
    // await extractAndSaveTokens(setCookieHeader)
    const jsonValue = JSON.stringify(data)
    await SecureStore.setItemAsync(USER_DATA_KEY, jsonValue)
  }
  return data
}

export async function logout() {
  await SecureStore.deleteItemAsync(USER_DATA_KEY)
}
