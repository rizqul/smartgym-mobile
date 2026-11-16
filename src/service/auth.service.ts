import AsyncStorage from "@react-native-async-storage/async-storage"
import CookieManager from "@react-native-cookies/cookies"
import api from "./api"

const USER_DATA_KEY = "@user_profile"

export async function login(email: string, password: string) {
  const response = await api.post("/login", { email, password })
  const { data } = response.data

  const jsonValue = JSON.stringify(data)
  await AsyncStorage.setItem(USER_DATA_KEY, jsonValue)

  return data
}

export async function logout() {
  await CookieManager.clearAll()
  await AsyncStorage.clear()
}
