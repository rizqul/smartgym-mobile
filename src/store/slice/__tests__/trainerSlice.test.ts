import { configureStore } from "@reduxjs/toolkit"
import { getAllTrainers } from "@/service/trainer.service"
import trainerReducer, { fetchTrainers } from "@/store/slice/trainerSlice"
import { Trainer } from "@/type/Trainer.type"

jest.mock("@/service/trainer.service", () => ({
  getAllTrainers: jest.fn()
}))

const mockGetAllTrainers = jest.mocked(getAllTrainers)
const trainers: Trainer[] = [
  {
    id: "trainer-1",
    name: "Alex Coach",
    email: "alex@example.com",
    profileUrl: "",
    phoneNumber: "",
    specialization: "STRENGTH_CONDITIONING",
    experience: 5,
    rate: 250000
  }
]

describe("trainer state", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("tracks trainer loading and stores results", async () => {
    let resolveRequest!: (value: Trainer[]) => void
    mockGetAllTrainers.mockReturnValueOnce(
      new Promise((resolve) => {
        resolveRequest = resolve
      })
    )
    const store = configureStore({ reducer: trainerReducer })

    const request = store.dispatch(fetchTrainers({ search: "strength", size: 20 }))
    expect(store.getState()).toMatchObject({ isLoading: true, error: null })

    resolveRequest(trainers)
    await request

    expect(mockGetAllTrainers).toHaveBeenCalledWith({ search: "strength", size: 20 })
    expect(store.getState()).toEqual({ result: trainers, isLoading: false, error: null })
  })

  it("stores a readable error and stops loading when trainer lookup fails", async () => {
    mockGetAllTrainers.mockRejectedValueOnce({ response: { data: { message: "Trainer service unavailable" } } })
    const store = configureStore({ reducer: trainerReducer })

    await store.dispatch(fetchTrainers())

    expect(store.getState()).toMatchObject({ isLoading: false, error: "Trainer service unavailable" })
  })
})
