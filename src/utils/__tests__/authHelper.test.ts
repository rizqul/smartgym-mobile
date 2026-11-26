import * as SecureStore from "expo-secure-store"
import { clearSession, extractAndSaveTokens, isTokenExpired, USER_DATA_KEY } from "@/utils/authHelper"

jest.mock("expo-secure-store", () => ({
  setItemAsync: jest.fn(),
  deleteItemAsync: jest.fn()
}))

const secureStore = jest.mocked(SecureStore)

describe("auth session helpers", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe("extractAndSaveTokens", () => {
    it("stores access and refresh tokens from a cookie header", async () => {
      const saved = await extractAndSaveTokens("access-token=access123; Path=/, refresh-token=refresh456; HttpOnly")

      expect(saved).toBe(true)
      expect(secureStore.setItemAsync).toHaveBeenNthCalledWith(1, "access-token", "access123")
      expect(secureStore.setItemAsync).toHaveBeenNthCalledWith(2, "refresh-token", "refresh456")
    })

    it("accepts cookie headers as an array and returns false without an access token", async () => {
      const saved = await extractAndSaveTokens(["refresh-token=refresh456; Path=/"])

      expect(saved).toBe(false)
      expect(secureStore.setItemAsync).toHaveBeenCalledWith("refresh-token", "refresh456")
      expect(secureStore.setItemAsync).not.toHaveBeenCalledWith("access-token", expect.anything())
    })

    it("returns false when no cookie header is provided", async () => {
      await expect(extractAndSaveTokens("")).resolves.toBe(false)
      expect(secureStore.setItemAsync).not.toHaveBeenCalled()
    })

    it("stores only an access token when no refresh token is returned", async () => {
      await expect(extractAndSaveTokens("access-token=onlyAccess; Secure")).resolves.toBe(true)

      expect(secureStore.setItemAsync).toHaveBeenCalledTimes(1)
      expect(secureStore.setItemAsync).toHaveBeenCalledWith("access-token", "onlyAccess")
    })
  })

  describe("clearSession", () => {
    it("removes both tokens and the persisted profile", async () => {
      await clearSession()

      expect(secureStore.deleteItemAsync).toHaveBeenCalledTimes(3)
      expect(secureStore.deleteItemAsync).toHaveBeenCalledWith("access-token")
      expect(secureStore.deleteItemAsync).toHaveBeenCalledWith("refresh-token")
      expect(secureStore.deleteItemAsync).toHaveBeenCalledWith(USER_DATA_KEY)
    })
  })

  describe("isTokenExpired", () => {
    const makeToken = (exp: number) => `header.${btoa(JSON.stringify({ exp }))}.signature`

    beforeEach(() => {
      jest.useFakeTimers()
      jest.setSystemTime(new Date("2026-01-01T00:00:00.000Z"))
    })

    afterEach(() => {
      jest.useRealTimers()
    })

    it("treats a token with enough remaining lifetime as valid", () => {
      expect(isTokenExpired(makeToken(Date.now() / 1000 + 60))).toBe(false)
    })

    it("treats a token inside the expiry buffer as expired", () => {
      expect(isTokenExpired(makeToken(Date.now() / 1000 + 20))).toBe(true)
    })

    it("supports a custom expiry buffer", () => {
      expect(isTokenExpired(makeToken(Date.now() / 1000 + 20), 10)).toBe(false)
    })

    it.each(["", "not-a-jwt", "header.invalid.signature"])("treats malformed token %p as expired", (token) => {
      expect(isTokenExpired(token)).toBe(true)
    })
  })
})
