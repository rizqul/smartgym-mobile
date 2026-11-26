import { fireEvent, render, waitFor } from "@testing-library/react-native"
import { configureStore } from "@reduxjs/toolkit"
import React from "react"
import { Provider } from "react-redux"
import TrainerScreen from "@/app/(gym)/navigation/trainer"
import { getAllTrainers } from "@/service/trainer.service"
import trainerReducer from "@/store/slice/trainerSlice"
import { Trainer } from "@/type/Trainer.type"

jest.mock("@/service/trainer.service", () => ({
  getAllTrainers: jest.fn()
}))
jest.mock("@/components/gym/templates/membershipGate", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => children
}))
jest.mock("@/components/gym/trainer/trainerCard", () => ({
  TrainerCard: () => null
}))
jest.mock("@expo/vector-icons", () => ({
  Ionicons: () => null,
  MaterialCommunityIcons: () => null
}))

const mockGetAllTrainers = jest.mocked(getAllTrainers)
const trainers: Trainer[] = [
  {
    id: "trainer-1",
    name: "Alex Coach",
    email: "alex@example.com",
    profileUrl: "",
    phoneNumber: "",
    specialization: "WEIGHT_LOSS",
    experience: 5,
    rate: 250000
  }
]

describe("trainer directory", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockGetAllTrainers.mockResolvedValue(trainers)
  })

  it("loads trainers and requests a selected specialization", async () => {
    const store = configureStore({ reducer: { trainer: trainerReducer } })
    const view = await render(
      <Provider store={store}>
        <TrainerScreen />
      </Provider>
    )

    await waitFor(() => expect(mockGetAllTrainers).toHaveBeenCalledWith({ search: "", size: 50 }))

    await fireEvent.press(view.getByText("Weight Loss"))

    await waitFor(() => expect(mockGetAllTrainers).toHaveBeenCalledWith({ search: "WEIGHT_LOSS", size: 50 }))
    expect(store.getState().trainer.result).toEqual(trainers)
  })
})
