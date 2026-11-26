import { configureStore } from "@reduxjs/toolkit"
import { getMyBookings } from "@/service/trainer.service"
import trainerBookingReducer, { fetchMyBookings } from "@/store/slice/trainerBookingSlice"
import { PaginationTrainerBookingResponse } from "@/type/trainerBooking.type"

jest.mock("@/service/trainer.service", () => ({
  getMyBookings: jest.fn()
}))

const mockGetMyBookings = jest.mocked(getMyBookings)
const bookings: PaginationTrainerBookingResponse = {
  data: [],
  pagination: {
    size: 20,
    currentPage: 1,
    totalPages: 0,
    totalData: 0,
    prevUrl: null,
    nextUrl: null,
    links: []
  }
}

describe("trainer booking state", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("tracks loading and stores the member booking history", async () => {
    let resolveRequest!: (value: PaginationTrainerBookingResponse) => void
    mockGetMyBookings.mockReturnValueOnce(
      new Promise((resolve) => {
        resolveRequest = resolve
      })
    )
    const store = configureStore({ reducer: trainerBookingReducer })

    const request = store.dispatch(fetchMyBookings({ size: 20 }))
    expect(store.getState()).toMatchObject({ isLoading: true, error: null })

    resolveRequest(bookings)
    await request

    expect(mockGetMyBookings).toHaveBeenCalledWith({ size: 20 })
    expect(store.getState()).toEqual({ result: bookings, isLoading: false, error: null })
  })

  it("shows a service error and stops loading when history cannot be fetched", async () => {
    mockGetMyBookings.mockRejectedValueOnce({ response: { data: { message: "Bookings unavailable" } } })
    const store = configureStore({ reducer: trainerBookingReducer })

    await store.dispatch(fetchMyBookings())

    expect(store.getState()).toMatchObject({ isLoading: false, error: "Bookings unavailable" })
  })

  it("uses a fallback message when the request has no server response", async () => {
    mockGetMyBookings.mockRejectedValueOnce(new Error("network down"))
    const store = configureStore({ reducer: trainerBookingReducer })

    await store.dispatch(fetchMyBookings())

    expect(store.getState()).toMatchObject({ isLoading: false, error: "Failed to fetch bookings" })
  })
})
