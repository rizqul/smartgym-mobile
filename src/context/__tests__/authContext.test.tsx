import AsyncStorage from "@react-native-async-storage/async-storage"
import * as SecureStore from "expo-secure-store"
import { act, render, waitFor } from "@testing-library/react-native"
import React from "react"
import { Text } from "react-native"
import { AuthProvider, useAuth } from "@/context/authContext"
import { refreshSession, setSessionExpiredHandler } from "@/service/api"
import { logoutAPI } from "@/service/auth.service"
import { getProfile } from "@/service/user.service"
import { clearSession, isTokenExpired, USER_DATA_KEY } from "@/utils/authHelper"

jest.mock("expo-secure-store", () => ({
  getItemAsync: jest.fn(),
  setItemAsync: jest.fn()
}))

jest.mock("@react-native-async-storage/async-storage", () => ({
  __esModule: true,
  default: { clear: jest.fn() }
}))

jest.mock("@/service/api", () => ({
  refreshSession: jest.fn(),
  setSessionExpiredHandler: jest.fn()
}))

jest.mock("@/service/auth.service", () => ({
  logoutAPI: jest.fn()
}))

jest.mock("@/service/user.service", () => ({
  getProfile: jest.fn()
}))

jest.mock("@/utils/authHelper", () => ({
  clearSession: jest.fn(),
  isTokenExpired: jest.fn(),
  USER_DATA_KEY: "user_profile"
}))

const secureStore = jest.mocked(SecureStore)
const mockRefreshSession = jest.mocked(refreshSession)
const mockSetSessionExpiredHandler = jest.mocked(setSessionExpiredHandler)
const mockLogoutAPI = jest.mocked(logoutAPI)
const mockGetProfile = jest.mocked(getProfile)
const mockClearSession = jest.mocked(clearSession)
const mockIsTokenExpired = jest.mocked(isTokenExpired)
const mockAsyncStorage = jest.mocked(AsyncStorage)

const storedUser = {
  id: "user-1",
  name: "Gym Member",
  email: "member@example.com",
  profileUrl: "",
  phoneNumber: "",
  membershipExpiredAt: null,
  role: "member",
  createdAt: "",
  updatedAt: ""
}

function AuthState() {
  const { isLoggedIn, isLoading, user, logout, refreshUser, refreshAuth } = useAuth()

  return (
    <>
      <Text testID="state">{JSON.stringify({ isLoggedIn, isLoading, user })}</Text>
      <Text
        testID="logout"
        onPress={() => void logout().catch(() => undefined)}
      />
      <Text
        testID="refresh-user"
        onPress={() => void refreshUser()}
      />
      <Text
        testID="refresh-auth"
        onPress={() => void refreshAuth()}
      />
    </>
  )
}

const getState = (view: Awaited<ReturnType<typeof render>>) => JSON.parse(view.getByTestId("state").props.children as string)

describe("AuthProvider", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    secureStore.getItemAsync.mockImplementation(async (key) => (key === USER_DATA_KEY ? JSON.stringify(storedUser) : null))
    mockIsTokenExpired.mockReturnValue(false)
    mockClearSession.mockResolvedValue(undefined)
    mockLogoutAPI.mockResolvedValue(undefined)
    mockRefreshSession.mockResolvedValue(undefined)
  })

  const renderAuth = async () =>
    render(
      <AuthProvider>
        <AuthState />
      </AuthProvider>
    )

  it("restores a session with a valid access token and loads the stored profile", async () => {
    secureStore.getItemAsync.mockImplementation(async (key) => {
      if (key === "access-token") return "valid-access"
      if (key === USER_DATA_KEY) return JSON.stringify(storedUser)
      return null
    })

    const view = await renderAuth()
    await waitFor(() => expect(getState(view)).toEqual({ isLoggedIn: true, isLoading: false, user: storedUser }))

    expect(mockIsTokenExpired).toHaveBeenCalledWith("valid-access")
    expect(mockRefreshSession).not.toHaveBeenCalled()
    expect(mockSetSessionExpiredHandler).toHaveBeenCalledWith(expect.any(Function))
  })

  it("keeps a valid session active when no saved profile exists", async () => {
    secureStore.getItemAsync.mockImplementation(async (key) => (key === "access-token" ? "valid-access" : null))

    const view = await renderAuth()
    await waitFor(() => expect(getState(view)).toEqual({ isLoggedIn: true, isLoading: false, user: null }))
  })

  it("refreshes an expired access token when a refresh token exists", async () => {
    secureStore.getItemAsync.mockImplementation(async (key) => {
      if (key === "access-token") return "expired-access"
      if (key === "refresh-token") return "refresh"
      if (key === USER_DATA_KEY) return JSON.stringify(storedUser)
      return null
    })
    mockIsTokenExpired.mockReturnValue(true)

    const view = await renderAuth()
    await waitFor(() => expect(getState(view)).toMatchObject({ isLoggedIn: true, isLoading: false }))

    expect(mockRefreshSession).toHaveBeenCalledTimes(1)
    expect(getState(view).user).toEqual(storedUser)
  })

  it("remains logged out when no tokens are available", async () => {
    secureStore.getItemAsync.mockResolvedValue(null)

    const view = await renderAuth()
    await waitFor(() => expect(getState(view)).toEqual({ isLoggedIn: false, isLoading: false, user: null }))

    expect(mockRefreshSession).not.toHaveBeenCalled()
    expect(mockClearSession).not.toHaveBeenCalled()
  })

  it("clears the session and user when auth restoration fails", async () => {
    secureStore.getItemAsync.mockImplementation(async (key) => {
      if (key === "refresh-token") return "refresh"
      if (key === USER_DATA_KEY) return JSON.stringify(storedUser)
      return null
    })
    mockRefreshSession.mockRejectedValueOnce(new Error("refresh failed"))

    const view = await renderAuth()
    await waitFor(() => expect(getState(view)).toEqual({ isLoggedIn: false, isLoading: false, user: null }))

    expect(mockClearSession).toHaveBeenCalledTimes(1)
  })

  it("clears local auth state even when the logout request fails", async () => {
    secureStore.getItemAsync.mockImplementation(async (key) =>
      key === USER_DATA_KEY ? JSON.stringify(storedUser) : key === "access-token" ? "valid" : null
    )
    mockLogoutAPI.mockRejectedValueOnce(new Error("server unavailable"))

    const view = await renderAuth()
    await waitFor(() => expect(getState(view).isLoggedIn).toBe(true))

    await act(async () => {
      view.getByTestId("logout").props.onPress()
    })

    await waitFor(() => expect(getState(view)).toEqual({ isLoggedIn: false, isLoading: false, user: null }))
    expect(mockClearSession).toHaveBeenCalledTimes(1)
    expect(mockAsyncStorage.clear).toHaveBeenCalledTimes(1)
  })

  it("refreshes the stored profile while preserving existing fields", async () => {
    secureStore.getItemAsync.mockImplementation(async (key) =>
      key === USER_DATA_KEY ? JSON.stringify(storedUser) : key === "access-token" ? "valid" : null
    )
    mockGetProfile.mockResolvedValueOnce({ data: { name: "Updated Member" } } as never)

    const view = await renderAuth()
    await waitFor(() => expect(getState(view).isLoggedIn).toBe(true))
    await act(async () => {
      view.getByTestId("refresh-user").props.onPress()
    })

    const updatedUser = { ...storedUser, name: "Updated Member" }
    await waitFor(() => expect(getState(view).user).toEqual(updatedUser))
    expect(secureStore.setItemAsync).toHaveBeenCalledWith(USER_DATA_KEY, JSON.stringify(updatedUser))
  })

  it("does not fetch a profile if there is no signed-in user", async () => {
    secureStore.getItemAsync.mockResolvedValue(null)

    const view = await renderAuth()
    await waitFor(() => expect(getState(view).isLoading).toBe(false))
    await act(async () => {
      view.getByTestId("refresh-user").props.onPress()
    })

    expect(mockGetProfile).not.toHaveBeenCalled()
  })

  it("rechecks credentials when refreshAuth is requested and unregisters its expiry callback on unmount", async () => {
    secureStore.getItemAsync.mockResolvedValue(null)
    const view = await renderAuth()
    await waitFor(() => expect(getState(view).isLoading).toBe(false))

    secureStore.getItemAsync.mockImplementation(async (key) =>
      key === USER_DATA_KEY ? JSON.stringify(storedUser) : key === "access-token" ? "valid" : null
    )
    await act(async () => {
      view.getByTestId("refresh-auth").props.onPress()
    })

    await waitFor(() => expect(getState(view)).toMatchObject({ isLoggedIn: true, user: storedUser }))
    expect(secureStore.getItemAsync).toHaveBeenCalledTimes(5)

    await view.unmount()
    expect(mockSetSessionExpiredHandler).toHaveBeenLastCalledWith(null)
  })

  it("clears the in-memory session when the API reports an expired session", async () => {
    secureStore.getItemAsync.mockImplementation(async (key) =>
      key === USER_DATA_KEY ? JSON.stringify(storedUser) : key === "access-token" ? "valid" : null
    )
    const view = await renderAuth()
    await waitFor(() => expect(getState(view)).toMatchObject({ isLoggedIn: true, user: storedUser }))

    const sessionExpiredHandler = mockSetSessionExpiredHandler.mock.calls[0]?.[0]
    expect(sessionExpiredHandler).toEqual(expect.any(Function))
    await act(async () => {
      sessionExpiredHandler?.()
    })

    expect(getState(view)).toEqual({ isLoggedIn: false, isLoading: false, user: null })
  })
})
