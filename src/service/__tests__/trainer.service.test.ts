import api from "@/service/api"
import { bookingTrainer, getAllTrainers, getMyBookings, getTrainerSlot } from "@/service/trainer.service"

jest.mock("@/service/api", () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    post: jest.fn()
  }
}))

const mockApi = jest.mocked(api)

describe("trainer service", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("requests trainer search and pagination and returns the trainer list", async () => {
    const trainers = [{ id: "trainer-1", name: "Alex Coach" }]
    mockApi.get.mockResolvedValueOnce({ data: { data: trainers } } as never)

    await expect(getAllTrainers({ search: "strength", page: 2, size: 10 })).resolves.toEqual(trainers)
    expect(mockApi.get).toHaveBeenCalledWith("/member/trainers", {
      params: { search: "strength", page: 2, size: 10 }
    })
  })

  it("omits an empty trainer search term", async () => {
    mockApi.get.mockResolvedValueOnce({ data: { data: [] } } as never)

    await getAllTrainers({ search: "", size: 50 })

    expect(mockApi.get).toHaveBeenCalledWith("/member/trainers", {
      params: { search: undefined, page: undefined, size: 50 }
    })
  })

  it("requests a trainer schedule for the selected date", async () => {
    const schedule = { data: [{ id: "slot-1", status: "AVAILABLE" }] }
    mockApi.get.mockResolvedValueOnce({ data: schedule } as never)

    await expect(getTrainerSlot("trainer-1", "2026-07-18")).resolves.toEqual(schedule)
    expect(mockApi.get).toHaveBeenCalledWith("/member/trainers/slot/trainer-1", {
      params: { date: "2026-07-18" }
    })
  })

  it("requests the member booking history with optional pagination", async () => {
    const bookings = { data: [], pagination: { currentPage: 1 } }
    mockApi.get.mockResolvedValueOnce({ data: bookings } as never)

    await expect(getMyBookings({ search: "Alex", size: 20 })).resolves.toEqual(bookings)
    expect(mockApi.get).toHaveBeenCalledWith("/member/trainers/booking", {
      params: { search: "Alex", size: 20 }
    })
  })

  it("omits an empty booking search term", async () => {
    mockApi.get.mockResolvedValueOnce({ data: {} } as never)

    await getMyBookings({ search: "" })

    expect(mockApi.get).toHaveBeenCalledWith("/member/trainers/booking", {
      params: { search: undefined, size: undefined }
    })
  })

  it("submits a booking with the selected slot and payment type", async () => {
    const order = { redirectUrl: "https://payment.example/checkout", orderId: "order-1" }
    mockApi.post.mockResolvedValueOnce({ data: { data: order } } as never)

    await expect(bookingTrainer("slot-1", "BCA_VA")).resolves.toEqual(order)
    expect(mockApi.post).toHaveBeenCalledWith("/member/trainers/booking", {
      slotId: "slot-1",
      paymentType: "BCA_VA"
    })
  })

  it("preserves booking request errors for the caller", async () => {
    const failure = new Error("booking unavailable")
    mockApi.post.mockRejectedValueOnce(failure)

    await expect(bookingTrainer("slot-1", "OTHER_QRIS")).rejects.toBe(failure)
  })
})
