import * as SecureStore from "expo-secure-store"
import api from "@/service/api"
import { extractAndSaveTokens, USER_DATA_KEY } from "@/utils/authHelper"
import { forgotPassword, login, logoutAPI, otpVerification, profile, resetPassword } from "@/service/auth.service"

jest.mock("@/service/api", () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    post: jest.fn()
  }
}))

jest.mock("@/utils/authHelper", () => ({
  extractAndSaveTokens: jest.fn(),
  USER_DATA_KEY: "user_profile"
}))

jest.mock("expo-secure-store", () => ({
  setItemAsync: jest.fn()
}))

const mockApi = jest.mocked(api)
const mockExtractAndSaveTokens = jest.mocked(extractAndSaveTokens)
const secureStore = jest.mocked(SecureStore)

describe("auth service", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe("login", () => {
    it("submits credentials, saves tokens and persists the returned profile when cookies are set", async () => {
      const user = { id: "user-1", email: "member@example.com" }
      mockApi.post.mockResolvedValueOnce({
        data: { data: user },
        headers: { "set-cookie": ["access-token=access", "refresh-token=refresh"] }
      } as never)
      mockExtractAndSaveTokens.mockResolvedValueOnce(true)

      await expect(login("member@example.com", "secret")).resolves.toEqual(user)

      expect(mockApi.post).toHaveBeenCalledWith("auth/login", { email: "member@example.com", password: "secret" })
      expect(mockExtractAndSaveTokens).toHaveBeenCalledWith(["access-token=access", "refresh-token=refresh"])
      expect(secureStore.setItemAsync).toHaveBeenCalledWith(USER_DATA_KEY, JSON.stringify(user))
    })

    it("returns the profile without persisting it when the response has no cookie", async () => {
      const user = { id: "user-1" }
      mockApi.post.mockResolvedValueOnce({ data: { data: user }, headers: {} } as never)

      await expect(login("member@example.com", "secret")).resolves.toEqual(user)

      expect(mockExtractAndSaveTokens).not.toHaveBeenCalled()
      expect(secureStore.setItemAsync).not.toHaveBeenCalled()
    })

    it("propagates login failures", async () => {
      const failure = new Error("offline")
      mockApi.post.mockRejectedValueOnce(failure)

      await expect(login("member@example.com", "secret")).rejects.toBe(failure)
    })
  })

  it("sends a forgot-password request and returns its response body", async () => {
    const response = { data: { message: "sent" } }
    mockApi.post.mockResolvedValueOnce(response as never)

    await expect(forgotPassword("member@example.com")).resolves.toEqual(response.data)
    expect(mockApi.post).toHaveBeenCalledWith("/auth/forgot-password", { email: "member@example.com" })
  })

  it("sends a password-reset request and returns its response body", async () => {
    const response = { data: { message: "updated" } }
    mockApi.post.mockResolvedValueOnce(response as never)

    await expect(resetPassword("NewPassword1!")).resolves.toEqual(response.data)
    expect(mockApi.post).toHaveBeenCalledWith("/auth/reset-password", { password: "NewPassword1!" })
  })

  it("returns the full OTP verification response", async () => {
    const response = { data: { valid: true }, status: 200 }
    mockApi.post.mockResolvedValueOnce(response as never)

    await expect(otpVerification("123456")).resolves.toBe(response)
    expect(mockApi.post).toHaveBeenCalledWith("/auth/reset-verify", { code: "123456" })
  })

  it("logs out through the API", async () => {
    mockApi.post.mockResolvedValueOnce({} as never)

    await expect(logoutAPI()).resolves.toBeUndefined()
    expect(mockApi.post).toHaveBeenCalledWith("/auth/logout")
  })

  it("loads the current profile and returns the response body", async () => {
    const response = { data: { id: "user-1", name: "Member" } }
    mockApi.get.mockResolvedValueOnce(response as never)

    await expect(profile()).resolves.toEqual(response.data)
    expect(mockApi.get).toHaveBeenCalledWith("/user")
  })
})
