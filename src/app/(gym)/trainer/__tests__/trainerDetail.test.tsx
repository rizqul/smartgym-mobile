import { fireEvent, render, waitFor } from "@testing-library/react-native"
import { configureStore } from "@reduxjs/toolkit"
import React from "react"
import { Provider } from "react-redux"
import TrainerProfile from "@/app/(gym)/trainer/trainerDetail"
import { getTrainerSlot } from "@/service/trainer.service"
import trainerReducer from "@/store/slice/trainerSlice"
import { Trainer, TrainerSlot } from "@/type/Trainer.type"
import { router, useLocalSearchParams } from "expo-router"

jest.mock("@/service/trainer.service", () => ({
  getAllTrainers: jest.fn(),
  getTrainerSlot: jest.fn()
}))
jest.mock("expo-router", () => ({
  router: (() => {
    const sharedRouter = { back: jest.fn(), push: jest.fn() }
    return sharedRouter
  })(),
  useRouter: () => jest.requireMock("expo-router").router,
  useLocalSearchParams: jest.fn()
}))
jest.mock("@expo/vector-icons", () => ({
  Ionicons: () => null,
  MaterialCommunityIcons: () => null
}))
jest.mock("expo-linear-gradient", () => ({
  LinearGradient: () => null
}))

const mockGetTrainerSlot = jest.mocked(getTrainerSlot)
const mockUseLocalSearchParams = jest.mocked(useLocalSearchParams)
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

describe("trainer schedule", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockUseLocalSearchParams.mockReturnValue({ id: "trainer-1" })
  })

  it("loads available slots and continues with the selected session", async () => {
    const startTime = new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString()
    const endTime = new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString()
    const slot: TrainerSlot = {
      id: "slot-1",
      description: "Strength session",
      startTime,
      endTime,
      status: "AVAILABLE",
      createdAt: startTime,
      updatedAt: startTime
    }
    mockGetTrainerSlot.mockResolvedValue({ data: [slot] })
    const store = configureStore({
      reducer: { trainer: trainerReducer },
      preloadedState: { trainer: { result: [trainer], isLoading: false, error: null } }
    })
    const view = await render(
      <Provider store={store}>
        <TrainerProfile />
      </Provider>
    )

    expect(await view.findByText("Strength session")).toBeTruthy()
    await waitFor(() => expect(mockGetTrainerSlot).toHaveBeenCalledWith("trainer-1", expect.any(String)))
    let slotLabel = view.getByText("Strength session")
    while (typeof slotLabel.props.onClick !== "function" && typeof slotLabel.props.onPress !== "function" && slotLabel.parent) {
      slotLabel = slotLabel.parent
    }
    if (typeof slotLabel.props.onClick === "function") await fireEvent(slotLabel, "click")
    else await fireEvent.press(slotLabel)
    await fireEvent.press(view.getByText("Continue"))

    expect(router.push).toHaveBeenCalledWith({
      pathname: "/trainer/bookingConfirm",
      params: {
        trainerId: "trainer-1",
        slotId: "slot-1",
        date: expect.any(String),
        startTime,
        endTime,
        description: "Strength session"
      }
    })
  })
})
