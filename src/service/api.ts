import CookieManager from "@react-native-cookies/cookies"
import axios from "axios"

const API_BASE_URL = "https://gymmick.my.id"

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json"
  }
})

// Interceptor Request: Ambil cookie dari native store dan masukkan ke header
api.interceptors.request.use(async (config) => {
  try {
    const cookies = await CookieManager.get(API_BASE_URL)
    const cookieString = Object.entries(cookies)
      .map(([name, cookie]) => `${name} = ${cookie.value}`)
      .join("; ")

    if (cookieString) {
      config.headers.Cookie = cookieString
    }
  } catch (error) {
    console.error("Gagal mengambil cookies:", error)
  }
  return config
})

export default api
