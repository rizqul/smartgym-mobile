import { configureStore } from "@reduxjs/toolkit"
import membershipReducer, { fetchMemberships } from "@/store/slice/membershipSlice"
import { getAllMemberships } from "@/service/membership.service"
import { TypePackage } from "@/type/membership.type"

jest.mock("@/service/membership.service", () => ({
  getAllMemberships: jest.fn()
}))

const mockGetAllMemberships = jest.mocked(getAllMemberships)

const packages: TypePackage = {
  WEEKLY: [{ id: "week", name: "Weekly", description: "", type: "WEEKLY", duration: 7, price: 100 }],
  MONTHLY: [],
  YEARLY: []
}

const createStore = () => configureStore({ reducer: membershipReducer })

describe("membership state", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("tracks loading while requesting packages and stores the result", async () => {
    let resolveRequest!: (data: TypePackage) => void
    mockGetAllMemberships.mockReturnValueOnce(
      new Promise((resolve) => {
        resolveRequest = resolve
      })
    )
    const store = createStore()

    const request = store.dispatch(fetchMemberships())
    expect(store.getState()).toMatchObject({ isLoading: true, error: null })

    resolveRequest(packages)
    await request

    expect(store.getState()).toEqual({ result: packages, isLoading: false, error: null })
  })

  it("stores the loading failure and stops the spinner", async () => {
    mockGetAllMemberships.mockRejectedValueOnce(new Error("Service unavailable"))
    const store = createStore()

    await store.dispatch(fetchMemberships())

    expect(store.getState()).toMatchObject({ isLoading: false, error: "Service unavailable" })
  })
})
