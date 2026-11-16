import { extractAndSaveTokens } from "@/utils/authHelper"
import * as SecureStore from "expo-secure-store"
import api from "./api"

const USER_DATA_KEY = "user_profile"

export async function login(email: string, password: string) {
  const response = await api.post("auth/login", { email, password })
  const { data } = response.data

  const setCookieHeader = response.headers["set-cookie"]

  if (setCookieHeader) {
    await extractAndSaveTokens(setCookieHeader)
    const jsonValue = JSON.stringify(data)
    await SecureStore.setItemAsync(USER_DATA_KEY, jsonValue)
  }
  return data
}

export async function Refresh() {
  const response = await api.post("auth/refresh")

  const setCookieHeader = response.headers["set-cookie"]

  if (setCookieHeader) {
    await extractAndSaveTokens(setCookieHeader)
  }
}

export async function ForgotPassword(email: string) {
  const response = await api.post("/auth/forgot-password", { email })
  return response.data
}

export async function ResetPassword(email: string, code: string, password: string) {
  const response = await api.post("/auth/reset-password", { email, code, password })
  return response.data
}

export async function logout() {
  await api.post("/auth/logout")
  await SecureStore.deleteItemAsync(USER_DATA_KEY)
}

export async function Profile() {
  const response = await api.get("/user")
  return response.data
}
