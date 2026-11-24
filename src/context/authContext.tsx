import { refreshSession, setSessionExpiredHandler } from "@/service/api"
import { logoutAPI } from "@/service/auth.service"
import { getProfile } from "@/service/user.service"
import { User } from "@/type/user.type"
import { clearSession, isTokenExpired, USER_DATA_KEY } from "@/utils/authHelper"
import AsyncStorage from "@react-native-async-storage/async-storage"
import * as SecureStore from "expo-secure-store"
import React, { createContext, useContext, useEffect, useState } from "react"

type AuthContextType = {
  isLoggedIn: boolean
  isLoading: boolean
  user: User | null
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
  refreshAuth: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType)
export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<User | null>(null)

  const loadUser = async () => {
    const json = await SecureStore.getItemAsync(USER_DATA_KEY)
    setUser(json ? JSON.parse(json) : null)
  }

  const refreshUser = async () => {
    if (!user) return
    const { data } = await getProfile()
    const updated = { ...user, ...data }
    await SecureStore.setItemAsync(USER_DATA_KEY, JSON.stringify(updated))
    setUser(updated)
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

      setUser(null)
      setIsLoggedIn(false)
    } catch (error) {
      await clearSession()
      setUser(null)
      setIsLoggedIn(false)
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    try {
      await logoutAPI()
    } catch (error) {
      console.log("Error :" + error)
    } finally {
      await clearSession()
      AsyncStorage.clear()
      setUser(null)
      setIsLoggedIn(false)
    }
  }

  const refreshAuth = async () => {
    await checkAuth()
  }

  return <AuthContext.Provider value={{ isLoggedIn, isLoading, logout, refreshUser, refreshAuth, user }}>{children}</AuthContext.Provider>
}
