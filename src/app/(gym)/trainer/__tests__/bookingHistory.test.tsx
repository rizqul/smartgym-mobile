import { fireEvent, render, waitFor } from "@testing-library/react-native"
import { configureStore } from "@reduxjs/toolkit"
import React from "react"
import { Provider } from "react-redux"
import BookingHistoryScreen from "@/app/(gym)/trainer/bookingHistory"
import { getMyBookings } from "@/service/trainer.service"
import trainerBookingReducer from "@/store/slice/trainerBookingSlice"
import { Trainer } from "@/type/Trainer.type"
import { PaginationTrainerBookingResponse, TrainerBookingResponse } from "@/type/trainerBooking.type"

jest.mock("@/service/trainer.service", () => ({
  getMyBookings: jest.fn()
}))
jest.mock("expo-router", () => {
  const React = jest.requireActual("react")
  return {
    useFocusEffect: (callback: () => void | (() => void)) => React.useEffect(callback, [callback]),
    useRouter: () => ({ push: jest.fn() })
  }
})
jest.mock("@/components/gym/templates/headerNavigation", () => ({
  __esModule: true,
  default: () => null
}))
jest.mock("@expo/vector-icons", () => ({
  Ionicons: () => null,
  MaterialCommunityIcons: () => null
}))
jest.mock("expo-linear-gradient", () => ({
  LinearGradient: () => null
}))

const mockGetMyBookings = jest.mocked(getMyBookings)
const trainer: Trainer = {
  id: "trainer-1",
  name: "Alex Coach",
  email: "alex@example.com",
  profileUrl: "",
  phoneNumber: "",
  specialization: "STRENGTH_CONDITIONING",
  experience: 5,
  rate: 250000
}

const makeBooking = (id: string, startTime: string, endTime: string, status: string): TrainerBookingResponse => ({
  id,
  member: { id: "member-1", name: "Member One", email: "member@example.com", profileUrl: null, phoneNumber: null },
  trainer,
  slot: {
    id: `slot-${id}`,
    description: "Strength session",
    startTime,
    endTime,
    status,
    createdAt: startTime,
    updatedAt: startTime
  }
})

describe("trainer booking history", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("loads bookings and separates upcoming sessions from completed and cancelled sessions", async () => {
    const now = Date.now()
    const upcoming = makeBooking(
      "upcoming-1",
      new Date(now + 2 * 60 * 60 * 1000).toISOString(),
      new Date(now + 3 * 60 * 60 * 1000).toISOString(),
      "PENDING"
    )
    const completed = makeBooking(
      "completed-1",
      new Date(now - 3 * 60 * 60 * 1000).toISOString(),
      new Date(now - 2 * 60 * 60 * 1000).toISOString(),
      "PAID"
    )
    const cancelled = makeBooking(
      "cancelled-1",
      new Date(now + 4 * 60 * 60 * 1000).toISOString(),
      new Date(now + 5 * 60 * 60 * 1000).toISOString(),
      "CANCELLED"
    )
    const response: PaginationTrainerBookingResponse = {
      data: [upcoming, completed, cancelled],
      pagination: { size: 50, currentPage: 1, totalPages: 1, totalData: 3, prevUrl: null, nextUrl: null, links: [] }
    }
    mockGetMyBookings.mockResolvedValue(response)
    const store = configureStore({ reducer: { trainerBooking: trainerBookingReducer } })
    const view = await render(
      <Provider store={store}>
        <BookingHistoryScreen />
      </Provider>
    )

    expect(await view.findByText("Alex Coach")).toBeTruthy()
    expect(view.getByText("Unpaid")).toBeTruthy()
    expect(view.queryByText("No upcoming sessions")).toBeNull()
    await waitFor(() => expect(mockGetMyBookings).toHaveBeenCalledWith({ size: 50 }))

    let doneTab = view.getByText("Done")
    while (typeof doneTab.props.onClick !== "function" && typeof doneTab.props.onPress !== "function" && doneTab.parent) {
      doneTab = doneTab.parent
    }
    if (typeof doneTab.props.onClick === "function") await fireEvent(doneTab, "click")
    else await fireEvent.press(doneTab)
    expect(view.getByText("PAID")).toBeTruthy()
    expect(view.getByText("Cancelled")).toBeTruthy()
    expect(view.queryByText("No session history")).toBeNull()
  })

  it("offers a retry when booking history fails to load", async () => {
    mockGetMyBookings.mockRejectedValue(new Error("network unavailable"))
    const store = configureStore({ reducer: { trainerBooking: trainerBookingReducer } })
    const view = await render(
      <Provider store={store}>
        <BookingHistoryScreen />
      </Provider>
    )

    expect(await view.findByText("Failed to load bookings")).toBeTruthy()
    await fireEvent.press(view.getByText("Try again"))

    await waitFor(() => expect(mockGetMyBookings).toHaveBeenCalledTimes(2))
  })
})
