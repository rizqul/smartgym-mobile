import { store } from "@/store/store"
import { Stack } from "expo-router"
import { Provider } from "react-redux"

export default function GymLayout() {
  return (
    <Provider store={store}>
      <Stack screenOptions={{ headerShown: false }} />
    </Provider>
  )
}
