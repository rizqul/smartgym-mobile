import { fireEvent, render, waitFor } from "@testing-library/react-native"
import { configureStore } from "@reduxjs/toolkit"
import React, { createElement as mockCreateElement } from "react"
import { Pressable as mockPressable, Text as mockText, View as mockView } from "react-native"
import { Provider } from "react-redux"
import { useAuth } from "@/context/authContext"
import Dashboard from "@/app/(gym)/navigation/dashboard"
import { checkOut, getActiveCheckin, getSummaryCheckin } from "@/service/scan.service"
import checkinReducer from "@/store/slice/checkinSlice"
import { CheckinResponse, SummaryCheckin } from "@/type/checkin.type"
import { User } from "@/type/user.type"
import { router } from "expo-router"
import { Toast } from "react-native-alert-notification"

jest.mock("@/context/authContext", () => ({ useAuth: jest.fn() }))
jest.mock("@/service/scan.service", () => ({
  checkOut: jest.fn(),
  getActiveCheckin: jest.fn(),
  getSummaryCheckin: jest.fn()
}))
jest.mock("expo-router", () => ({ router: { push: jest.fn() } }))
jest.mock("react-native-alert-notification", () => ({
  ALERT_TYPE: { DANGER: "danger", SUCCESS: "success" },
  Toast: { show: jest.fn() }
}))
jest.mock("@expo/vector-icons", () => ({
  MaterialCommunityIcons: () => null,
  MaterialIcons: () => null
}))
jest.mock("@/components/gym/dashboard/aiSummaryCard", () => ({ AiSummaryCard: () => null }))
jest.mock("@/components/gym/dashboard/fitnessProgressCard", () => ({ FitnessProgressCard: () => null }))
jest.mock("@/components/gym/dashboard/membershipCard", () => ({ MembershipCard: () => null }))
jest.mock("@/components/gym/dashboard/trainerCard", () => ({ TrainerCard: () => null }))
jest.mock("@/components/gym/dashboard/weeklyActivityCard", () => ({ WeeklyActivityCard: () => null }))
jest.mock("@/components/gym/dashboard/checkinCard", () => ({
  __esModule: true,
  default: ({ handleCheckout }: { handleCheckout: () => void }) =>
    mockCreateElement(mockPressable, { onPress: handleCheckout }, mockCreateElement(mockText, null, "Checkout"))
}))
jest.mock("@/components/gym/templates/blurRefreshScrollView", () => ({
  BlurRefreshScrollView: ({ children, onRefresh }: { children: React.ReactNode; onRefresh: () => Promise<void> }) =>
    mockCreateElement(
      mockView,
      null,
      children,
      mockCreateElement(
        mockPressable,
        { accessibilityLabel: "Refresh dashboard", onPress: onRefresh },
        mockCreateElement(mockText, null, "Refresh")
      )
    )
}))
jest.mock("@/components/gym/templates/appModal", () => ({
  __esModule: true,
  default: ({
    visible,
    title,
    primaryLabel,
    onPrimary,
    secondaryLabel,
    onClose
  }: {
    visible: boolean
    title: string
    primaryLabel: string
    onPrimary: () => void
    secondaryLabel?: string
    onClose: () => void
  }) =>
    visible
      ? mockCreateElement(
          mockView,
          null,
          mockCreateElement(mockText, null, title),
          secondaryLabel ? mockCreateElement(mockPressable, { onPress: onClose }, mockCreateElement(mockText, null, secondaryLabel)) : null,
          mockCreateElement(mockPressable, { onPress: onPrimary }, mockCreateElement(mockText, null, primaryLabel))
        )
      : null
}))

const member: User = {
  id: "member-1",
  name: "Alex Morgan",
  email: "alex@example.com",
  profileUrl: "",
  phoneNumber: "",
  membershipExpiredAt: null,
  role: "member",
  createdAt: "2025-01-01T00:00:00.000Z",
  updatedAt: "2025-01-01T00:00:00.000Z"
}

const activeSession: CheckinResponse = {
  id: "checkin-1",
  member,
  method: "QR",
  status: "ACCEPTED",
  checkInAt: "2026-01-01T10:00:00.000Z",
  checkOutAt: null,
  denialReason: null
}

const summary: SummaryCheckin = {
  totalGymMinutes: 450,
  totalGymHours: 7.5,
  currentStreak: 2,
  longestStreak: 4,
  totalVisits: 8,
  lastCheckInAt: "2026-01-01T10:00:00.000Z",
  checkedInToday: true
}

const mockUseAuth = jest.mocked(useAuth)
const mockGetActiveCheckin = jest.mocked(getActiveCheckin)
const mockGetSummaryCheckin = jest.mocked(getSummaryCheckin)
const mockCheckOut = jest.mocked(checkOut)
const mockRouterPush = jest.mocked(router.push)
const mockToastShow = jest.mocked(Toast.show)
const mockRefreshUser = jest.fn()

const makeStore = (activeCheckin: CheckinResponse | null = null) =>
  configureStore({
    reducer: { checkin: checkinReducer },
    preloadedState: { checkin: { activeCheckin } }
  })

const renderDashboard = async (activeCheckin: CheckinResponse | null = null) => {
  const store = makeStore(activeCheckin)
  const view = await render(
    <Provider store={store}>
      <Dashboard />
    </Provider>
  )
  return { view, store }
}

describe("dashboard", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockUseAuth.mockReturnValue({
      isLoggedIn: true,
      isLoading: false,
      user: member,
      logout: jest.fn(),
      refreshUser: mockRefreshUser,
      refreshAuth: jest.fn()
    })
    mockRefreshUser.mockResolvedValue(undefined)
    mockGetSummaryCheckin.mockResolvedValue(summary)
    mockGetActiveCheckin.mockResolvedValue(null)
    mockCheckOut.mockResolvedValue(activeSession)
  })

  it("greets the signed-in member and loads dashboard summary and check-in state", async () => {
    const { view } = await renderDashboard()

    expect(await view.findByText(/Hello,\s*Alex/)).toBeTruthy()
    await waitFor(() => {
      expect(mockGetSummaryCheckin).toHaveBeenCalledTimes(1)
      expect(mockGetActiveCheckin).toHaveBeenCalledTimes(1)
    })
  })

  it("navigates to check-in, membership, and trainer schedules from dashboard actions", async () => {
    const { view } = await renderDashboard()

    await fireEvent.press(view.getByText("Check-in Scan"))
    await fireEvent.press(view.getByText("Membership"))
    await fireEvent.press(view.getByText("Schedule"))

    expect(mockRouterPush).toHaveBeenNthCalledWith(1, "/(gym)/dashboard/scanQR")
    expect(mockRouterPush).toHaveBeenNthCalledWith(2, "/(gym)/dashboard/membership")
    expect(mockRouterPush).toHaveBeenNthCalledWith(3, "/(gym)/trainer/bookingHistory")
  })

  it("refreshes the profile and reloads the summary and active check-in", async () => {
    const { view } = await renderDashboard()
    await waitFor(() => expect(mockGetSummaryCheckin).toHaveBeenCalledTimes(1))

    await fireEvent.press(view.getByLabelText("Refresh dashboard"))

    await waitFor(() => {
      expect(mockRefreshUser).toHaveBeenCalledTimes(1)
      expect(mockGetSummaryCheckin).toHaveBeenCalledTimes(2)
      expect(mockGetActiveCheckin).toHaveBeenCalledTimes(2)
    })
  })

  it("notifies the member when their summary cannot be loaded", async () => {
    mockGetSummaryCheckin.mockRejectedValueOnce(new Error("offline"))

    await renderDashboard()

    await waitFor(() =>
      expect(mockToastShow).toHaveBeenCalledWith(expect.objectContaining({ type: "danger", title: "Failed", textBody: "Try again" }))
    )
  })

  it.each([400, 503])("clears a stale check-in when status lookup fails with %i", async (status) => {
    mockGetActiveCheckin.mockRejectedValueOnce({ response: { status } })
    const { store } = await renderDashboard(activeSession)

    await waitFor(() => expect(store.getState().checkin.activeCheckin).toBeNull())
  })

  it("ends an active workout only after confirmation and clears the active session", async () => {
    mockGetActiveCheckin.mockResolvedValue(activeSession)
    const { view, store } = await renderDashboard()
    await waitFor(() => expect(store.getState().checkin.activeCheckin).toEqual(activeSession))

    await fireEvent.press(view.getByText("Checkout"))
    expect(view.getByText("Are you sure want to checkout?")).toBeTruthy()
    await fireEvent.press(view.getByText("No"))
    expect(mockCheckOut).not.toHaveBeenCalled()

    await fireEvent.press(view.getByText("Checkout"))
    await fireEvent.press(view.getByText("Yes, Checkout"))

    await waitFor(() => expect(store.getState().checkin.activeCheckin).toBeNull())
    expect(mockCheckOut).toHaveBeenCalledTimes(1)
    expect(mockToastShow).toHaveBeenCalledWith(
      expect.objectContaining({ type: "success", title: "Successful", textBody: "Training session complete" })
    )
  })

  it("keeps the active check-in when checkout fails", async () => {
    mockGetActiveCheckin.mockResolvedValue(activeSession)
    mockCheckOut.mockRejectedValueOnce(new Error("offline"))
    const { view, store } = await renderDashboard()
    await waitFor(() => expect(store.getState().checkin.activeCheckin).toEqual(activeSession))

    await fireEvent.press(view.getByText("Checkout"))
    await fireEvent.press(view.getByText("Yes, Checkout"))

    await waitFor(() =>
      expect(mockToastShow).toHaveBeenCalledWith(expect.objectContaining({ type: "danger", title: "Failed", textBody: "Try again" }))
    )
    expect(store.getState().checkin.activeCheckin).toEqual(activeSession)
  })
})
