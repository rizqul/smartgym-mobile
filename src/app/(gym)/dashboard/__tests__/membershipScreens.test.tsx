import { fireEvent, render, waitFor } from "@testing-library/react-native"
import { configureStore } from "@reduxjs/toolkit"
import React, { createElement as mockCreateElement } from "react"
import { View as mockView } from "react-native"
import { Provider } from "react-redux"
import Membership from "@/app/(gym)/dashboard/membership"
import MembershipConfirm from "@/app/(gym)/dashboard/membershipConfirm"
import PlanConfirmationCard from "@/components/gym/membership/membershhipPlanConfirmation"
import { buyMembership, getAllMemberships } from "@/service/membership.service"
import membershipReducer from "@/store/slice/membershipSlice"
import { TypePackage } from "@/type/membership.type"
import { router, useLocalSearchParams } from "expo-router"
import { Toast } from "react-native-alert-notification"

jest.mock("@/service/membership.service", () => ({
  buyMembership: jest.fn(),
  getAllMemberships: jest.fn()
}))
jest.mock("expo-router", () => ({
  Link: ({ children }: { children: React.ReactNode }) => children,
  router: { push: jest.fn(), replace: jest.fn() },
  useLocalSearchParams: jest.fn()
}))
jest.mock("react-native-alert-notification", () => ({
  ALERT_TYPE: { DANGER: "danger" },
  Toast: { show: jest.fn() }
}))
jest.mock("expo-linear-gradient", () => ({
  LinearGradient: ({ children }: { children: React.ReactNode }) => mockCreateElement(mockView, null, children)
}))
jest.mock("@expo/vector-icons", () => ({
  AntDesign: () => null,
  Ionicons: () => null,
  MaterialIcons: () => null
}))
jest.mock("@/components/gym/templates/headerNavigation", () => ({
  __esModule: true,
  default: () => null
}))
jest.mock("@/components/gym/membership/membershipConsultCard", () => ({
  __esModule: true,
  default: () => null
}))

const packages: TypePackage = {
  WEEKLY: [
    {
      id: "weekly-1",
      name: "Weekly",
      description: "A short membership plan description\nFasilitas:\n- Gym access",
      type: "WEEKLY",
      duration: 7,
      price: 100000
    }
  ],
  MONTHLY: [
    {
      id: "monthly-1",
      name: "Monthly",
      description: "A monthly membership plan description\nBenefits:\n- Gym access",
      type: "MONTHLY",
      duration: 30,
      price: 300000
    }
  ],
  YEARLY: [
    {
      id: "yearly-1",
      name: "Yearly",
      description: "A yearly membership plan description\nFacilities:\n- Gym access",
      type: "YEARLY",
      duration: 365,
      price: 3000000
    }
  ]
}

const mockBuyMembership = jest.mocked(buyMembership)
const mockGetAllMemberships = jest.mocked(getAllMemberships)
const mockRouterPush = jest.mocked(router.push)
const mockRouterReplace = jest.mocked(router.replace)
const mockToastShow = jest.mocked(Toast.show)
const mockUseLocalSearchParams = jest.mocked(useLocalSearchParams)

const makeStore = (result: TypePackage | null = packages) =>
  configureStore({
    reducer: { membership: membershipReducer },
    preloadedState: {
      membership: { result, isLoading: false, error: null }
    }
  })

const renderWithMembershipStore = async (screen: React.ReactElement, result: TypePackage | null = packages) => {
  const store = makeStore(result)
  const view = await render(<Provider store={store}>{screen}</Provider>)
  return { view, store }
}

describe("membership screens", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockGetAllMemberships.mockResolvedValue(packages)
    mockUseLocalSearchParams.mockReturnValue({ id: "weekly-1" } as never)
  })

  it("loads available packages and routes with the selected plan id", async () => {
    mockGetAllMemberships.mockResolvedValueOnce(packages)
    const { view } = await renderWithMembershipStore(<Membership />, null)

    await waitFor(() => expect(view.getAllByLabelText("Select Plan")).toHaveLength(3))
    expect(view.getByText("Weekly")).toBeTruthy()
    expect(view.getByText("Monthly")).toBeTruthy()
    expect(view.getByText("Yearly")).toBeTruthy()

    await fireEvent.press(view.getAllByLabelText("Select Plan")[1])
    await fireEvent.press(view.getAllByLabelText("Select Plan")[0])
    await fireEvent.press(view.getAllByLabelText("Select Plan")[2])
    expect(mockRouterPush).toHaveBeenNthCalledWith(1, {
      pathname: "/(gym)/dashboard/membershipConfirm",
      params: { id: "monthly-1" }
    })
    expect(mockRouterPush).toHaveBeenNthCalledWith(2, {
      pathname: "/(gym)/dashboard/membershipConfirm",
      params: { id: "weekly-1" }
    })
    expect(mockRouterPush).toHaveBeenNthCalledWith(3, {
      pathname: "/(gym)/dashboard/membershipConfirm",
      params: { id: "yearly-1" }
    })
  }, 15000)

  it("shows no plans when the membership request fails", async () => {
    mockGetAllMemberships.mockRejectedValueOnce(new Error("offline"))
    const { view } = await renderWithMembershipStore(<Membership />, null)

    await waitFor(() => expect(view.queryByLabelText("Select Plan")).toBeNull())
  })

  it.each([
    ["weekly-1", "Weekly", "100000"],
    ["monthly-1", "Monthly", "300000"],
    ["yearly-1", "Yearly", "3000000"]
  ])("shows the selected %s plan in confirmation", async (id, name, price) => {
    mockUseLocalSearchParams.mockReturnValue({ id } as never)

    const { view } = await renderWithMembershipStore(<MembershipConfirm />)

    expect(view.getAllByText(name)).toHaveLength(2)
    expect(view.getAllByText(`Rp ${price}`)).toHaveLength(2)
  })

  it("creates a QRIS order and opens the returned payment page", async () => {
    mockBuyMembership.mockResolvedValueOnce({
      redirectUrl: "https://checkout.example/pay",
      orderId: "order-1"
    })
    const { view } = await renderWithMembershipStore(<MembershipConfirm />)

    await fireEvent.press(view.getByText("Continue to Payment"))

    await waitFor(() => expect(mockBuyMembership).toHaveBeenCalledWith("weekly-1", "OTHER_QRIS"))
    expect(mockRouterReplace).toHaveBeenCalledWith({
      pathname: "/(gym)/dashboard/paymentScreen",
      params: {
        paymentUrl: "https://checkout.example/pay",
        type: "membership",
        orderId: "order-1"
      }
    })
  })

  it("uses the chosen bank virtual account for the order", async () => {
    mockBuyMembership.mockResolvedValueOnce({ redirectUrl: "https://checkout.example", orderId: "order-2" })
    const { view } = await renderWithMembershipStore(<MembershipConfirm />)

    await fireEvent.press(view.getByLabelText("Transfer bank / Virtual Account"))
    await fireEvent.press(view.getByLabelText("BCA"))
    await fireEvent.press(view.getByText("Continue to Payment"))

    await waitFor(() => expect(mockBuyMembership).toHaveBeenCalledWith("weekly-1", "BCA_VA"))
  })

  it.each([
    [{ response: { data: { message: "Membership payment rejected" } } }, "Payment Failed", "Membership payment rejected"],
    [{ response: { data: {} } }, "Payment Failed", "A server error occurred"],
    [{ request: {} }, "Connection Problem", expect.stringContaining("Unable to connect")],
    [new Error("Payment service unavailable"), "Payment Failed", "Payment service unavailable"]
  ])("reports payment errors and stays on confirmation", async (failure, title, textBody) => {
    mockBuyMembership.mockRejectedValueOnce(failure)
    const { view } = await renderWithMembershipStore(<MembershipConfirm />)

    await fireEvent.press(view.getByText("Continue to Payment"))

    await waitFor(() => expect(mockToastShow).toHaveBeenCalledWith(expect.objectContaining({ title, textBody })))
    expect(mockRouterReplace).not.toHaveBeenCalled()
  })

  it("shows a benefit list and lets the member change plans", async () => {
    const onChangePlan = jest.fn()
    const view = await render(
      <PlanConfirmationCard
        badge="MONTHLY"
        name="Monthly"
        description={"Flexible access\nBenefits:\n- Gym access"}
        price="Rp 300000"
        duration="30 days"
        onChangePlan={onChangePlan}
      />
    )

    expect(view.getByText("Flexible access")).toBeTruthy()
    expect(view.getByText("Gym access")).toBeTruthy()
    await fireEvent.press(view.getByLabelText("Change plan"))
    expect(onChangePlan).toHaveBeenCalledTimes(1)
  })

  it("renders a plan without a benefits heading as a simple description", async () => {
    const view = await render(
      <PlanConfirmationCard
        badge="WEEKLY"
        name="Weekly"
        description="A flexible gym membership"
        price="Rp 100000"
        duration="7 days"
      />
    )

    expect(view.getByText("A flexible gym membership")).toBeTruthy()
    expect(view.queryByText("What you get")).toBeNull()
    expect(view.queryByLabelText("Change plan")).toBeNull()
  })
})
