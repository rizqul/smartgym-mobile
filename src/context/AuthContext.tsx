import CookieManager from "@react-native-cookies/cookies"
import React, { createContext, useContext, useEffect, useState } from "react"

const API_URL = "https://gymmick.my.id"

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
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const cookies = await CookieManager.get(API_URL)

      const hasSession = !!(cookies["access-token"] || cookies["refresh-token"])
      setIsLoggedIn(hasSession)
    } catch (error) {
      console.error("Gagal mengecek cookie:", error)
      setIsLoggedIn(false)
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    await CookieManager.clearAll()
    setIsLoggedIn(false)
  }

  const refreshAuth = async () => {
    await checkAuth()
  }

  return <AuthContext.Provider value={{ isLoggedIn, isLoading, logout, refreshAuth }}>{children}</AuthContext.Provider>
}
