import { Link } from "expo-router"
import { Text, View } from "react-native"

export default function Login() {
  return (
    <View>
      <Text className="font-inter text-2xl">Ini Login Page</Text>

      <Link href="/(auth)/forgot-password">Ke Forgot Password</Link>
      <Link href="/(gym)">Ke Halaman Utama</Link>
    </View>
  )
}
