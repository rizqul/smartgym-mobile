import { AuthProvider, useAuth } from "@/context/AuthContext"
import { useFonts } from "expo-font"
import { Stack } from "expo-router"
import * as SplashScreen from "expo-splash-screen"
import { useEffect } from "react"
import { Provider } from "react-redux"
import { PersistGate } from "redux-persist/integration/react"

import { persistor, store } from "@/store/store"
import { ActivityIndicator, View } from "react-native"
import { AlertNotificationRoot } from "react-native-alert-notification"
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
          card: "#1A1D24",
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
          loading={
            <View className="flex-1 bg-background justify-center items-center">
              <ActivityIndicator size="large" color="#FF6B00" />
            </View>
          }
          persistor={persistor}
        >
          <AuthProvider>
            <RootLayoutNav />
          </AuthProvider>
        </PersistGate>
      </Provider>
    </AlertNotificationRoot>
  )
}