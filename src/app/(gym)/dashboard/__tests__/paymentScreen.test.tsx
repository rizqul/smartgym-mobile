import { fireEvent, render, waitFor } from "@testing-library/react-native"
import React, { createElement as mockCreateElement } from "react"
import { Pressable as mockPressable, Text as mockText, View as mockView } from "react-native"
import PaymentScreen from "@/app/(gym)/dashboard/paymentScreen"
import { router, useLocalSearchParams, useRouter } from "expo-router"

jest.mock("expo-router", () => ({
  router: { push: jest.fn(), dismissTo: jest.fn() },
  useRouter: jest.fn(),
  useLocalSearchParams: jest.fn()
}))
jest.mock("expo-linking", () => ({
  parse: (link: string) => ({
    queryParams: Object.fromEntries(new URL(link).searchParams.entries())
  })
}))
jest.mock("react-native-webview", () => ({
  WebView: ({
    source,
    onShouldStartLoadWithRequest
  }: {
    source: { uri: string }
    onShouldStartLoadWithRequest: (request: { url: string }) => boolean
  }) => {
    const callbackPath = source.uri.includes("booking") ? "pt-booking" : "membership"
    return mockCreateElement(
      mockView,
      null,
      mockCreateElement(mockText, null, source.uri),
      ...["settlement", "capture", "pending", "expire"].map((status) =>
        mockCreateElement(
          mockPressable,
          {
            key: status,
            accessibilityLabel: `Payment status ${status}`,
            onPress: () =>
              onShouldStartLoadWithRequest({
                url: `https://payment.example/midtrans/${callbackPath}?transaction_status=${status}`
              })
          },
          mockCreateElement(mockText, null, status)
        )
      ),
      mockCreateElement(
        mockPressable,
        {
          accessibilityLabel: "Open external page",
          onPress: () => onShouldStartLoadWithRequest({ url: "https://payment.example/other-page" })
        },
        mockCreateElement(mockText, null, "External page")
      )
    )
  }
}))
jest.mock("@/components/gym/templates/appModal", () => ({
  __esModule: true,
  default: ({
    visible,
    title,
    message,
    primaryLabel,
    onPrimary
  }: {
    visible: boolean
    title: string
    message?: string
    primaryLabel: string
    onPrimary: () => void
  }) =>
    visible
      ? mockCreateElement(
          mockView,
          null,
          mockCreateElement(mockText, null, title),
          message ? mockCreateElement(mockText, null, message) : null,
          mockCreateElement(mockPressable, { onPress: onPrimary }, mockCreateElement(mockText, null, primaryLabel))
        )
      : null
}))

const mockUseLocalSearchParams = jest.mocked(useLocalSearchParams)
const mockUseRouter = jest.mocked(useRouter)
const mockDismissTo = jest.mocked(router.dismissTo)
const mockPush = jest.mocked(router.push)

describe("payment result screen", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockUseLocalSearchParams.mockReturnValue({
      paymentUrl: "https://checkout.example/order-1",
      type: "membership",
      orderId: "order-1"
    } as never)
    mockUseRouter.mockReturnValue(router)
  })

  it("shows a successful result for a completed membership payment and opens its transaction", async () => {
    const view = await render(<PaymentScreen />)

    expect(view.getByText("https://checkout.example/order-1")).toBeTruthy()
    await fireEvent.press(view.getByLabelText("Payment status settlement"))
    expect(view.getByText("Payment Successful")).toBeTruthy()
    expect(view.getByText("Your payment has been received. Your membership will be active shortly.")).toBeTruthy()

    await fireEvent.press(view.getByText("View Transaction"))
    expect(mockDismissTo).toHaveBeenCalledWith("/(gym)/navigation/dashboard")
    expect(mockPush).toHaveBeenCalledWith({
      pathname: "/(gym)/profile/transactionDetail",
      params: { id: "order-1" }
    })
  })

  it.each([
    ["capture", "Payment Successful"],
    ["pending", "Waiting for Payment"],
    ["expire", "Payment Failed"]
  ])("maps transaction status %s to the corresponding result", async (status, title) => {
    const view = await render(<PaymentScreen />)

    await fireEvent.press(view.getByLabelText(`Payment status ${status}`))
    expect(view.getByText(title)).toBeTruthy()
  })

  it("does not interrupt unrelated web pages or process a duplicate callback", async () => {
    const view = await render(<PaymentScreen />)

    await fireEvent.press(view.getByLabelText("Open external page"))
    expect(view.queryByText("Payment Successful")).toBeNull()

    await fireEvent.press(view.getByLabelText("Payment status pending"))
    expect(view.getByText("Waiting for Payment")).toBeTruthy()
    await fireEvent.press(view.getByLabelText("Payment status settlement"))
    expect(view.getByText("Waiting for Payment")).toBeTruthy()
    expect(view.queryByText("Payment Successful")).toBeNull()
  })

  it("uses the booking callback path and result message for trainer payments", async () => {
    mockUseLocalSearchParams.mockReturnValue({
      paymentUrl: "https://checkout.example/booking",
      type: "pt-booking",
      orderId: "booking-1"
    } as never)
    const view = await render(<PaymentScreen />)

    await fireEvent.press(view.getByLabelText("Payment status settlement"))

    expect(view.getByText("Payment Successful")).toBeTruthy()
    expect(view.getByText("Your payment has been received. Your trainer session is being confirmed.")).toBeTruthy()
  })

  it("returns to the dashboard and transaction detail after dismissing the result", async () => {
    const view = await render(<PaymentScreen />)

    await fireEvent.press(view.getByLabelText("Payment status pending"))
    await fireEvent.press(view.getByText("View Transaction"))

    await waitFor(() => {
      expect(mockDismissTo).toHaveBeenCalledTimes(1)
      expect(mockPush).toHaveBeenCalledTimes(1)
    })
  })
})
