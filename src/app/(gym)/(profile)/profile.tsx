import { ScrollView, StatusBar, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

export default function Profile() {
  return (
    <SafeAreaView className="flex bg-background">
      <StatusBar barStyle="light-content" />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="flex gap-5 px-5 pb-10 pt-3"> {/* HEADER SECTION */}</View>
      </ScrollView>
    </SafeAreaView>
  )
}
