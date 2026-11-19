// service/api.ts
import { clearSession, extractAndSaveTokens } from "@/utils/authHelper"
import axios, { AxiosError, InternalAxiosRequestConfig } from "axios"
import * as SecureStore from "expo-secure-store"

const API_BASE_URL = "https://api.gymmick.my.id"
axios.defaults.withCredentials = false

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: false,
  headers: { "Content-Type": "application/json" }
})

api.interceptors.request.use(async (config) => {
  try {
    const accessToken = await SecureStore.getItemAsync("access-token")
    const refreshToken = await SecureStore.getItemAsync("refresh-token")

    let cookieString = ""
    if (accessToken) cookieString += `access-token=${accessToken}; `
    if (refreshToken) cookieString += `refresh-token=${refreshToken}; `

    if (cookieString) {
      config.headers.Cookie = cookieString.trim()
    }
  } catch (error) {
    console.error("Gagal mengambil token:", error)
  }
  return config
})

const isTokenError = (error: AxiosError) => {
  const status = error.response?.status
  if (status === 401) return true

  if (status === 400) {
    const message = String((error.response?.data as any)?.message ?? "")
    return /token jwt/i.test(message)
  }
  return false
}

// ---------- refresh ----------
let refreshPromise: Promise<void> | null = null

const doRefresh = async () => {
  const refreshToken = await SecureStore.getItemAsync("refresh-token")
  if (!refreshToken) throw new Error("Tidak ada refresh token")

  let res
  try {
    res = await axios.post(`${API_BASE_URL}/auth/refresh`, null, {
      withCredentials: false,
      headers: { Cookie: `refresh-token=${refreshToken}` }
    })
  } catch (e: any) {
    console.log("[AUTH] refresh ditolak:", e?.response?.status, JSON.stringify(e?.response?.data))
    throw e
  }

  const saved = await extractAndSaveTokens(res.headers["set-cookie"] as string | string[])
  if (!saved) throw new Error("Refresh gagal")
}

export const refreshSession = () => {
  if (!refreshPromise) {
    refreshPromise = doRefresh().finally(() => {
      refreshPromise = null
    })
  }
  return refreshPromise
}

let onSessionExpired: (() => void) | null = null
export const setSessionExpiredHandler = (fn: (() => void) | null) => {
  onSessionExpired = fn
}

api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const original = error.config as (InternalAxiosRequestConfig & { _retry?: boolean }) | undefined
    const status = error.response?.status
    const url = original?.url ?? ""

    if (!isTokenError(error) || !original || original._retry || url.includes("auth/")) {
      return Promise.reject(error)
    }

    console.log("[AUTH] 401 pada", url, "→ mencoba refresh")

    original._retry = true

    try {
      await refreshSession()
      return api(original)
    } catch (e) {
      await clearSession()
      onSessionExpired?.()
      return Promise.reject(e)
    }
  }
)

export default api
