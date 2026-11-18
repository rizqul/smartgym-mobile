import { useAuth } from "@/context/AuthContext"
import { Redirect } from "expo-router"
import React from "react"

const index = () => {
  const { isLoggedIn } = useAuth()
  return <Redirect href={isLoggedIn ? "/(gym)/navigation/dashboard" : "/(auth)/login"} />
}

export default index
