import { USER_DATA_KEY } from "@/service/auth.service"
import * as SecureStore from "expo-secure-store"

export const extractAndSaveTokens = async (setCookieHeaders: string | string[]) => {
  if (!setCookieHeaders) return false

  const cookieArray = Array.isArray(setCookieHeaders) ? setCookieHeaders.join(", ") : setCookieHeaders

  const accessToken = cookieArray.match(/(?:^|[\s,;])access-token=([^;,\s]+)/)?.[1]
  const refreshToken = cookieArray.match(/(?:^|[\s,;])refresh-token=([^;,\s]+)/)?.[1]

  if (accessToken) await SecureStore.setItemAsync("access-token", accessToken)
  if (refreshToken) await SecureStore.setItemAsync("refresh-token", refreshToken)

  return !!accessToken
}

export const clearSession = async () => {
  await SecureStore.deleteItemAsync("access-token")
  await SecureStore.deleteItemAsync("refresh-token")
  await SecureStore.deleteItemAsync(USER_DATA_KEY)
}

// Hanya berlaku kalau access token berupa JWT
export const isTokenExpired = (token: string, bufferSeconds = 30) => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]))
    return payload.exp * 1000 < Date.now() + bufferSeconds * 1000
  } catch {
    return true
  }
}
