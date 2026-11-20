import { extractAndSaveTokens, USER_DATA_KEY } from "@/utils/authHelper"
import * as SecureStore from "expo-secure-store"
import api from "./api"

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

export async function ForgotPassword(email: string) {
  const response = await api.post("/auth/forgot-password", { email })
  return response.data
}

export async function ResetPassword(password: string) {
  const response = await api.post("/auth/reset-password", { password })
  return response.data
}

export async function OtpVerification(code: string) {
  const response = await api.post("/auth/reset-verify", { code })
  console.log(response)
  return response
}

export async function LogoutAPI() {
  await api.post("/auth/logout")
}

export async function Profile() {
  const response = await api.get("/user")
  return response.data
}
