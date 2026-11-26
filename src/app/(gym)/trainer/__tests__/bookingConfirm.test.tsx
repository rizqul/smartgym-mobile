import { fireEvent, render, waitFor } from "@testing-library/react-native"
import { configureStore } from "@reduxjs/toolkit"
import React from "react"
import { Provider } from "react-redux"
import BookingConfirm from "@/app/(gym)/trainer/bookingConfirm"
import { bookingTrainer } from "@/service/trainer.service"
import trainerReducer from "@/store/slice/trainerSlice"
import { Trainer } from "@/type/Trainer.type"
import { Toast } from "react-native-alert-notification"
import { router, useLocalSearchParams } from "expo-router"

jest.mock("@/service/trainer.service", () => ({
  bookingTrainer: jest.fn(),
  getAllTrainers: jest.fn()
}))
jest.mock("expo-router", () => ({
  router: (() => {
    const sharedRouter = { back: jest.fn(), replace: jest.fn() }
    return sharedRouter
  })(),
  useRouter: () => jest.requireMock("expo-router").router,
  useLocalSearchParams: jest.fn()
}))
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
jest.mock("react-native-alert-notification", () => ({
  ALERT_TYPE: { DANGER: "danger" },
  Toast: { show: jest.fn() }
}))

const mockBookingTrainer = jest.mocked(bookingTrainer)
const mockUseLocalSearchParams = jest.mocked(useLocalSearchParams)
const mockToastShow = jest.mocked(Toast.show)
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

const renderBookingConfirm = async () => {
  const store = configureStore({
    reducer: { trainer: trainerReducer },
    preloadedState: { trainer: { result: [trainer], isLoading: false, error: null } }
  })
  return render(
    <Provider store={store}>
      <BookingConfirm />
    </Provider>
  )
}

describe("trainer booking confirmation", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockUseLocalSearchParams.mockReturnValue({
      trainerId: "trainer-1",
      slotId: "slot-1",
      date: "2026-07-18",
      startTime: "2026-07-18T08:00:00.000Z",
      endTime: "2026-07-18T09:00:00.000Z",
      description: "Strength session"
    })
    mockBookingTrainer.mockResolvedValue({ redirectUrl: "https://payment.example", orderId: "order-1" })
  })

  it("requires the terms to be accepted before creating a QRIS booking order", async () => {
    const view = await renderBookingConfirm()

    let confirmButton = view.getByText("Confirm Booking")
    while (typeof confirmButton.props.onPress !== "function" && confirmButton.parent) confirmButton = confirmButton.parent
    await fireEvent.press(confirmButton)
    expect(mockBookingTrainer).not.toHaveBeenCalled()

    let terms = view.getByText("I agree to the Booking Terms")
    while (typeof terms.props.onClick !== "function" && typeof terms.props.onPress !== "function" && terms.parent) terms = terms.parent
    if (typeof terms.props.onClick === "function") await fireEvent(terms, "click")
    else await fireEvent.press(terms)
    confirmButton = view.getByText("Confirm Booking")
    while (typeof confirmButton.props.onClick !== "function" && typeof confirmButton.props.onPress !== "function" && confirmButton.parent) {
      confirmButton = confirmButton.parent
    }
    if (typeof confirmButton.props.onClick === "function") await fireEvent(confirmButton, "click")
    else await fireEvent.press(confirmButton)

    await waitFor(() => expect(mockBookingTrainer).toHaveBeenCalledWith("slot-1", "OTHER_QRIS"))
    expect(router.replace).toHaveBeenCalledWith({
      pathname: "/(gym)/dashboard/paymentScreen",
      params: { paymentUrl: "https://payment.example", type: "pt-booking", orderId: "order-1" }
    })
  })

  it("reports booking failures without navigating away", async () => {
    mockBookingTrainer.mockRejectedValueOnce({ response: { data: { message: "Slot was just booked" } } })
    const view = await renderBookingConfirm()
    let terms = view.getByText("I agree to the Booking Terms")
    while (typeof terms.props.onClick !== "function" && typeof terms.props.onPress !== "function" && terms.parent) terms = terms.parent
    if (typeof terms.props.onClick === "function") await fireEvent(terms, "click")
    else await fireEvent.press(terms)
    let confirmButton = view.getByText("Confirm Booking")
    while (typeof confirmButton.props.onClick !== "function" && typeof confirmButton.props.onPress !== "function" && confirmButton.parent) {
      confirmButton = confirmButton.parent
    }
    if (typeof confirmButton.props.onClick === "function") await fireEvent(confirmButton, "click")
    else await fireEvent.press(confirmButton)

    await waitFor(() =>
      expect(mockToastShow).toHaveBeenCalledWith(
        expect.objectContaining({ type: "danger", title: "Payment Failed", textBody: "Slot was just booked" })
      )
    )
    expect(mockBookingTrainer).toHaveBeenCalledWith("slot-1", "OTHER_QRIS")
    expect(router.replace).not.toHaveBeenCalled()
    expect(view.getByText("Confirm Booking")).toBeTruthy()
  })
})
