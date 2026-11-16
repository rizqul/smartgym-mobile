// app/_layout.tsx
import { AuthProvider, useAuth } from "@/context/AuthContext"
import { useFonts } from "expo-font"
import { Stack } from "expo-router"
import * as SplashScreen from "expo-splash-screen"
import { useEffect } from "react"

import "../../global.css"

void SplashScreen.preventAutoHideAsync()

function RootLayoutNav() {
  const { isLoggedIn, isLoading } = useAuth()
  const [loaded, error] = useFonts([
    {
      fontFamily: "Inter",
      fontDefinitions: [{ path: require("@/assets/fonts/InterVariable.ttf") }]
    }
  ])

  const appIsReady = loaded && !isLoading

  useEffect(() => {
    if (appIsReady || error) {
      void SplashScreen.hideAsync()
    }
  }, [appIsReady, error])

  if (!appIsReady && !error) return null

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={!isLoggedIn}>
        <Stack.Screen name="(auth)/login" />
      </Stack.Protected>

      <Stack.Protected guard={isLoggedIn}>
        <Stack.Screen name="(gym)/dashboard" />
      </Stack.Protected>
    </Stack>
  )
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  )
}
