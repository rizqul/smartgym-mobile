import { Link } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export default function Index() {
  return (
    <View style={styles.container}>
      <Text className="font-inter">Edit src/app/index.tsx to edit this screen.</Text>

      <Link href="/(gym)/workout">Ke Halaman Workout</Link>
      <Link
        href={{
          pathname: "/(gym)/workout",
          params: {
            search: "2"
          }
        }}
      >
        Ke Halaman Workout
      </Link>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  }
})
