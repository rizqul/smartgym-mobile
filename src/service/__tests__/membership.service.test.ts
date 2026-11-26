import api from "@/service/api"
import { buyMembership, getAllMemberships } from "@/service/membership.service"
import { TypePackage } from "@/type/membership.type"

jest.mock("@/service/api", () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    post: jest.fn()
  }
}))

const mockApi = jest.mocked(api)

const packages: TypePackage = {
  WEEKLY: [],
  MONTHLY: [],
  YEARLY: []
}

describe("membership service", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("creates an order using the selected package and payment method", async () => {
    const order = { redirectUrl: "https://payment.example/checkout", orderId: "order-1" }
    mockApi.post.mockResolvedValueOnce({ data: { data: order } } as never)

    await expect(buyMembership("package-1", "BCA_VA")).resolves.toEqual(order)
    expect(mockApi.post).toHaveBeenCalledWith("/member/membership/order", {
      packageId: "package-1",
      paymentType: "BCA_VA"
    })
  })

  it("preserves order errors for the caller", async () => {
    const failure = new Error("payment unavailable")
    mockApi.post.mockRejectedValueOnce(failure)

    await expect(buyMembership("package-1", "OTHER_QRIS")).rejects.toBe(failure)
  })

  it("returns all membership package groups", async () => {
    mockApi.get.mockResolvedValueOnce({ data: { data: packages } } as never)

    await expect(getAllMemberships()).resolves.toEqual(packages)
    expect(mockApi.get).toHaveBeenCalledWith("member/membership")
  })

  it("propagates membership loading errors", async () => {
    const failure = new Error("membership unavailable")
    mockApi.get.mockRejectedValueOnce(failure)

    await expect(getAllMemberships()).rejects.toBe(failure)
  })
})
