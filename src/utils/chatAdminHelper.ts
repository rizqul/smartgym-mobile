import * as Linking from "expo-linking"
import { Alert } from "react-native"

export const ChatAdminWA = async () => {
  const phone = "6285801051358"
  const message = "Halo Admin, saya ingin bertanya tentang layanan Anda."
  const url = `https://wa.me{phone}?text=${encodeURIComponent(message)}`

  try {
    const supported = await Linking.canOpenURL(url)
    if (supported) {
      await Linking.openURL(url)
    } else {
      Alert.alert("Error", "WhatsApp tidak terpasang di perangkat ini.")
    }
  } catch (error) {
    Alert.alert("Error", "Gagal membuka WhatsApp.")
  }
}
