import { useAuth } from "@/context/authContext"
import { Redirect } from "expo-router"
import React from "react"

const index = () => {
  const { isLoggedIn } = useAuth()
  return <Redirect href={isLoggedIn ? "/(gym)/navigation/dashboard" : "/(auth)/login"} />
}

export default index
