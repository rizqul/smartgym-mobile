// context/AuthContext.tsx
import { LogoutAPI, USER_DATA_KEY } from "@/service/auth.service"
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
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const token = await SecureStore.getItemAsync("access-token")
      setIsLoggedIn(!!token)
    } catch (error) {
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
      await SecureStore.deleteItemAsync("access-token")
      await SecureStore.deleteItemAsync("refresh-token")
      await SecureStore.deleteItemAsync(USER_DATA_KEY)
      setIsLoggedIn(false)
    }
  }

  const refreshAuth = async () => {
    await checkAuth()
  }

  return <AuthContext.Provider value={{ isLoggedIn, isLoading, logout, refreshAuth }}>{children}</AuthContext.Provider>
}
