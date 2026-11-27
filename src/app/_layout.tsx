import { AuthProvider, useAuth } from "@/context/authContext"
import { useFonts } from "expo-font"
import { Stack } from "expo-router"
import * as SplashScreen from "expo-splash-screen"
import { useEffect, useState } from "react"
import { Provider } from "react-redux"
import { PersistGate } from "redux-persist/integration/react"

import SplashLoadingScreen from "@/components/splashScreen"
import { persistor, store } from "@/store/store"
import { AlertNotificationRoot } from "react-native-alert-notification"
import "../../global.css"

void SplashScreen.preventAutoHideAsync()

function RootLayoutNav({ isMinTimeElapsed }: Readonly<{ isMinTimeElapsed: boolean }>) {
  const { isLoggedIn, isLoading } = useAuth()
  const [loaded, error] = useFonts([
    {
      fontFamily: "Inter",
      fontDefinitions: [{ path: require("@/assets/fonts/InterVariable.ttf") }]
    }
  ])

  useEffect(() => {
    if (loaded || error) {
      void SplashScreen.hideAsync()
    }
  }, [loaded, error])

  const appIsReady = (loaded || error) && !isLoading && isMinTimeElapsed

  if (!appIsReady && !error) return <SplashLoadingScreen />

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />

      <Stack.Protected guard={!isLoggedIn}>
        <Stack.Screen name="(auth)" />
      </Stack.Protected>

      <Stack.Protected guard={isLoggedIn}>
        <Stack.Screen name="(gym)" />
      </Stack.Protected>
    </Stack>
  )
}

export default function RootLayout() {
  const [isMinTimeElapsed, setIsMinTimeElapsed] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMinTimeElapsed(true)
    }, 5000)

    return () => clearTimeout(timer)
  }, [])
  return (
    <AlertNotificationRoot
      theme="dark"
      colors={[
        {
          label: "#1C1F26",
          card: "#FFFFFF",
          overlay: "#000000",
          success: "#22C55E",
          danger: "#EF4444",
          warning: "#FFD166",
          info: "#60A5FA"
        },
        {
          label: "#FF6B00",
          card: "#242833",
          overlay: "#000000",
          success: "#34D399",
          danger: "#EF4444",
          warning: "#FFD166",
          info: "#60A5FA"
        }
      ]}
      toastConfig={{
        autoClose: 5000,
        titleStyle: { fontFamily: "Inter", fontWeight: "700", fontSize: 14 },
        textBodyStyle: { fontFamily: "Inter", fontSize: 12, color: "#E2BFB0" }
      }}
    >
      <Provider store={store}>
        <PersistGate
          loading={<SplashLoadingScreen />}
          persistor={persistor}
        >
          <AuthProvider>
            <RootLayoutNav isMinTimeElapsed={isMinTimeElapsed} />
          </AuthProvider>
        </PersistGate>
      </Provider>
    </AlertNotificationRoot>
  )
}
