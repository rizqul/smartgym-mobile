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
      {/* 1. TAB HOME */}
      <Tabs.Screen
        name="dashboard"
        options={{
          title: "Home",
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              size={24}
              color={color as string}
            />
          ),
          tabBarLabel: ({ focused, color }) => TabLabel({ focused: focused, color: color as string, title: "Home" })
        }}
      />

      {/* 2. TAB TRAINER */}
      <Tabs.Screen
        name="trainer"
        options={{
          title: "Trainer",
          tabBarIcon: ({ focused, color }) => (
            <MaterialCommunityIcons
              name={focused ? "account-star" : "account-star-outline"}
              size={24}
              color={color as string}
            />
          ),
          tabBarLabel: ({ focused, color }) => TabLabel({ focused: focused, color: color as string, title: "Trainer" })
        }}
      />

      {/* 3. TAB AI COACH (Pengganti AI) */}
      <Tabs.Screen
        name="ai"
        options={{
          title: "AI Coach", // Title yang lebih bagus dan profesional
          tabBarIcon: ({ focused, color }) => (
            <MaterialCommunityIcons
              name={focused ? "brain" : "brain"}
              size={24}
              color={color as string}
            />
          ),
          tabBarLabel: ({ focused, color }) => TabLabel({ focused: focused, color: color as string, title: "AI Coach" })
        }}
      />

      {/* 4. TAB PROFILE */}
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name={focused ? "person" : "person-outline"}
              size={24}
              color={color as string}
            />
          ),
          tabBarLabel: ({ focused, color }) => TabLabel({ focused: focused, color: color as string, title: "Profile" })
        }}
      />
    </Tabs>
  )
}
