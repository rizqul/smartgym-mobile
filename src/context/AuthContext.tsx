import { refreshSession, setSessionExpiredHandler } from "@/service/api"
import { LogoutAPI } from "@/service/auth.service"
import { clearSession, isTokenExpired } from "@/utils/authHelper"
import * as SecureStore from "expo-secure-store"
import React, { createContext, useContext, useEffect, useState } from "react"

type AuthContextType = {
  isLoggedIn: boolean
  isLoading: boolean
  logout: () => Promise<void>
  refreshAuth: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType)
export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Interceptor memanggil ini kalau refresh gagal
    setSessionExpiredHandler(() => setIsLoggedIn(false))
    checkAuth()
    return () => setSessionExpiredHandler(null)
  }, [])

  const checkAuth = async () => {
    try {
      const accessToken = await SecureStore.getItemAsync("access-token")
      const refreshToken = await SecureStore.getItemAsync("refresh-token")

      // 1. Access token masih valid
      if (accessToken && !isTokenExpired(accessToken)) {
        setIsLoggedIn(true)
        return
      }

      // 2. Expire, tapi masih ada refresh token → coba perbarui
      if (refreshToken) {
        await refreshSession()
        setIsLoggedIn(true)
        return
      }

      // 3. Tidak ada token sama sekali
      setIsLoggedIn(false)
    } catch (error) {
      // Refresh gagal (refresh token juga expire/tidak valid)
      await clearSession()
      setIsLoggedIn(false)
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    try {
      await LogoutAPI()
    } catch (error) {
      console.log("Error :" + error)
    } finally {
      await clearSession()
      setIsLoggedIn(false)
    }
  }

  const refreshAuth = async () => {
    await checkAuth()
  }

  return <AuthContext.Provider value={{ isLoggedIn, isLoading, logout, refreshAuth }}>{children}</AuthContext.Provider>
}
