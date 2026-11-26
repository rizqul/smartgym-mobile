import { Linking } from "react-native"

export const ChatAdminWA = async () => {
  const phone = "6285801051358"
  const message = "Halo Admin, saya ingin bertanya tentang layanan Anda."

  const appUrl = `whatsapp://send?phone=${phone}&text=${encodeURIComponent(message)}`
  const webUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`

  try {
    await Linking.openURL(appUrl)
  } catch (error) {
    await Linking.openURL(webUrl)
  }
}
