import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons"
import { Tabs } from "expo-router"
import React from "react"
import { Text, View } from "react-native"

const TabLabel = ({ focused, color, title }: { focused: boolean; color: string; title: string }) => {
  return (
    <View style={{ alignItems: "center", justifyContent: "center" }}>
      <Text style={{ color: color, fontSize: 10, fontWeight: "700" }}>{title}</Text>
      <View style={{ height: 6, marginTop: 2, justifyContent: "center" }}>
        {focused && (
          <View
            style={{
              width: 4,
              height: 4,
              borderRadius: 2,
              backgroundColor: "#F97316"
            }}
          />
        )}
      </View>
    </View>
  )
}

export default function GymLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#1C1F26",
          borderTopWidth: 0,
          height: 80,
          paddingBottom: 12,
          paddingTop: 12,
          elevation: 0,
          shadowOpacity: 0
        },
        tabBarActiveTintColor: "#F97316",
        tabBarInactiveTintColor: "#D6B8A6"
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: "Home",
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              size={24}
              color={color}
            />
          ),
          tabBarLabel: ({ focused, color }) => (
            <TabLabel
              focused={focused}
              color={color}
              title="Home"
            />
          )
        }}
      />

      <Tabs.Screen
        name="workout"
        options={{
          title: "Workout",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="dumbbell"
              size={24}
              color={color}
            />
          ),
          tabBarLabel: ({ focused, color }) => (
            <TabLabel
              focused={focused}
              color={color}
              title="Workout"
            />
          )
        }}
      />

      <Tabs.Screen
        name="history"
        options={{
          title: "History",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="chart-timeline-variant-shimmer"
              size={24}
              color={color}
            />
          ),
          tabBarLabel: ({ focused, color }) => (
            <TabLabel
              focused={focused}
              color={color}
              title="History"
            />
          )
        }}
      />

      <Tabs.Screen
        name="pass"
        options={{
          title: "Pass",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="card-account-details-outline"
              size={24}
              color={color}
            />
          ),
          tabBarLabel: ({ focused, color }) => (
            <TabLabel
              focused={focused}
              color={color}
              title="Pass"
            />
          )
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          headerShown: false,
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name={focused ? "person" : "person-outline"}
              size={24}
              color={color}
            />
          ),
          tabBarLabel: ({ focused, color }) => (
            <TabLabel
              focused={focused}
              color={color}
              title="Profile"
            />
          )
        }}
      />
    </Tabs>
  )
}
