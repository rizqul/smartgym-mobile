import * as SecureStore from "expo-secure-store"

export const extractAndSaveTokens = async (setCookieHeaders: string | string[]) => {
  if (!setCookieHeaders) return false

  // Di React Native, header set-cookie bisa berupa string atau array of strings
  const cookieArray = Array.isArray(setCookieHeaders) ? setCookieHeaders : [setCookieHeaders]

  let accessToken = ""
  let refreshToken = ""

  cookieArray.forEach((cookieString) => {
    // Parse string: "access-token=xyz; Path=/; ..." menjadi "access-token=xyz"
    const tokenPair = cookieString.split(";")[0].trim()
    const [key, value] = tokenPair.split("=")

    if (key === "access-token") accessToken = value
    if (key === "refresh-token") refreshToken = value
  })

  if (accessToken && refreshToken) {
    await SecureStore.setItemAsync("access-token", accessToken)
    await SecureStore.setItemAsync("refresh-token", refreshToken)
    return true
  }
  return false
}
