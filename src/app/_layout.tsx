import { useEffect } from "react"
import { Text } from "react-native"

import { useFonts } from "expo-font"
import { Stack } from "expo-router"
import * as SplashScreen from "expo-splash-screen"

import "../../global.css"

void SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  const [loaded, error] = useFonts([
    {
      fontFamily: "Inter",
      fontDefinitions: [
        {
          path: require("@/assets/fonts/InterVariable.ttf")
        }
      ]
    }
  ])

  useEffect(() => {
    if (loaded || error) void SplashScreen.hideAsync()
  }, [loaded, error])

  if (!loaded && !error) return <Text>Loading</Text>

  // const isLogin = false

  return (
    <Stack
      screenOptions={{
        headerShown: false
      }}
    >
      <Stack.Screen
        name="(auth)/login"
        options={{ headerShown: false }}
      />

      <Stack.Protected guard={true}>
        <Stack.Screen
          name="(gym)"
          options={{ headerShown: false }}
        />
      </Stack.Protected>
    </Stack>
  )
}
