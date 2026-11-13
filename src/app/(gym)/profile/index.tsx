import { Link } from "expo-router"
import React from "react"
import { Text, View } from "react-native"

export default function index() {
  return (
    <View>
      <Text>index</Text>
      <Text>index</Text>
      <Text>index</Text>
      <Text>index</Text>
      <Text>index</Text>
      <Text>index</Text>
      <Text>index</Text>

      <Link href="/(gym)/profile/test">Test</Link>
    </View>
  )
}
