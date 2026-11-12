import { useLocalSearchParams } from "expo-router"
import { Text, View } from "react-native"

export default function Workout() {
  const { search = 1 } = useLocalSearchParams()

  return (
    <View>
      <Text>{search}</Text>
      <Text>Ini Workout Page</Text>
    </View>
  )
}
