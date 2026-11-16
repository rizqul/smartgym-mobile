// service/api.ts
import axios from "axios"
import * as SecureStore from "expo-secure-store"

const API_BASE_URL = "https://gymmick.my.id"

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json"
  }
})

// Interceptor Request: Kirim token sebagai cookie
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

export default api
