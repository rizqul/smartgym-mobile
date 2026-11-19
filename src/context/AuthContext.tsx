import { refreshSession, setSessionExpiredHandler } from "@/service/api"
import { LogoutAPI } from "@/service/auth.service"
import { User } from "@/type/user.type"
import { clearSession, isTokenExpired, USER_DATA_KEY } from "@/utils/authHelper"
import * as SecureStore from "expo-secure-store"
import React, { createContext, useContext, useEffect, useState } from "react"

type AuthContextType = {
  isLoggedIn: boolean
  isLoading: boolean
  user: User | null
  logout: () => Promise<void>
  refreshAuth: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType)
export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<User | null>(null)

  const loadUser = async () => {
    const json = await SecureStore.getItemAsync(USER_DATA_KEY)
    setUser(json ? JSON.parse(json) : null)
  }

  useEffect(() => {
    // Interceptor memanggil ini kalau refresh gagal
    setSessionExpiredHandler(() => {
      setUser(null)
      setIsLoggedIn(false)
    })
    checkAuth()
    return () => setSessionExpiredHandler(null)
  }, [])

  const checkAuth = async () => {
    try {
      const accessToken = await SecureStore.getItemAsync("access-token")
      const refreshToken = await SecureStore.getItemAsync("refresh-token")

      // 1. Access token masih valid
      if (accessToken && !isTokenExpired(accessToken)) {
        await loadUser()
        setIsLoggedIn(true)
        return
      }

      // 2. Expire, tapi masih ada refresh token → coba perbarui
      if (refreshToken) {
        await loadUser()
        await refreshSession()
        setIsLoggedIn(true)
        return
      }

      // 3. Tidak ada token sama sekali
      setUser(null)
      setIsLoggedIn(false)
    } catch (error) {
      // Refresh gagal (refresh token juga expire/tidak valid)
      await clearSession()
      setUser(null)
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
      setUser(null)
      setIsLoggedIn(false)
    }
  }

  const refreshAuth = async () => {
    await checkAuth()
  }

  return <AuthContext.Provider value={{ isLoggedIn, isLoading, logout, refreshAuth, user }}>{children}</AuthContext.Provider>
}
