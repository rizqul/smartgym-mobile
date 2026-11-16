import * as SecureStore from "expo-secure-store"

export const extractAndSaveTokens = async (setCookieHeaders: string | string[]) => {
  if (!setCookieHeaders) return false

  const cookieArray = Array.isArray(setCookieHeaders) ? setCookieHeaders.join(", ") : setCookieHeaders

  const accessToken = cookieArray.match(/(?:^|[\s,;])access-token=([^;,\s]+)/)?.[1]
  const refreshToken = cookieArray.match(/(?:^|[\s,;])refresh-token=([^;,\s]+)/)?.[1]

  if (accessToken) await SecureStore.setItemAsync("access-token", accessToken)
  if (refreshToken) await SecureStore.setItemAsync("refresh-token", refreshToken)

  return !!accessToken
}
