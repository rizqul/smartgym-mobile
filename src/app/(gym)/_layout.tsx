import { Tabs } from "expo-router"

export default function GymLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home"
        }}
      />

      <Tabs.Screen
        name="workout"
        options={{
          title: "Workout"
        }}
      />
    </Tabs>
  )
}
