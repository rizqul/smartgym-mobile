import { fireEvent, render, waitFor } from "@testing-library/react-native"
import React, { createElement as mockCreateElement } from "react"
import { TextInput as mockTextInput } from "react-native"
import { useAuth } from "@/context/authContext"
import { forgotPassword, login, otpVerification, resetPassword } from "@/service/auth.service"
import Login from "@/app/(auth)/login"
import ForgotPassword from "@/app/(auth)/forgotPassword"
import OtpResetPassword from "@/app/(auth)/otp"
import ResetPassword from "@/app/(auth)/reset-password"
import { router } from "expo-router"
import { Toast } from "react-native-alert-notification"

jest.mock("@/service/auth.service", () => ({
  forgotPassword: jest.fn(),
  login: jest.fn(),
  otpVerification: jest.fn(),
  resetPassword: jest.fn()
}))

jest.mock("@/context/authContext", () => ({
  useAuth: jest.fn()
}))

jest.mock("expo-router", () => ({
  Link: ({ children }: { children: unknown }) => children,
  router: { push: jest.fn() },
  useLocalSearchParams: () => ({ email: "member@example.com" })
}))

jest.mock("react-native-alert-notification", () => ({
  ALERT_TYPE: { DANGER: "danger", SUCCESS: "success" },
  Toast: { show: jest.fn() }
}))

jest.mock("react-native-otp-entry", () => {
  return {
    OtpInput: (props: { onTextChange: (value: string) => void }) =>
      mockCreateElement(mockTextInput, {
        accessibilityLabel: "OTP code",
        onChangeText: props.onTextChange
      })
  }
})

jest.mock("@expo/vector-icons", () => ({
  Entypo: () => null,
  Ionicons: () => null,
  Fontisto: () => null,
  MaterialIcons: () => null,
  MaterialCommunityIcons: () => null,
  AntDesign: () => null
}))

jest.mock("@expo/vector-icons/Fontisto", () => ({ __esModule: true, default: () => null }))
jest.mock("@expo/vector-icons/MaterialIcons", () => ({ __esModule: true, default: () => null }))
jest.mock("@expo/vector-icons/MaterialCommunityIcons", () => ({ __esModule: true, default: () => null }))
jest.mock("@expo/vector-icons/AntDesign", () => ({ __esModule: true, default: () => null }))

const mockRefreshAuth = jest.fn()
const mockLogin = jest.mocked(login)
const mockForgotPassword = jest.mocked(forgotPassword)
const mockOtpVerification = jest.mocked(otpVerification)
const mockResetPassword = jest.mocked(resetPassword)
const mockRouterPush = jest.mocked(router.push)
const mockToastShow = jest.mocked(Toast.show)
const mockUseAuth = jest.mocked(useAuth)

describe("authentication screens", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.useRealTimers()
    mockUseAuth.mockReturnValue({
      isLoggedIn: false,
      isLoading: false,
      user: null,
      logout: jest.fn(),
      refreshUser: jest.fn(),
      refreshAuth: mockRefreshAuth
    })
  })

  describe("login", () => {
    it("validates credentials before sending a login request", async () => {
      const view = await render(<Login />)
      await fireEvent.changeText(view.getByPlaceholderText("Enter your email"), "not-an-email")
      await fireEvent.changeText(view.getByPlaceholderText("Enter your password"), "")
      await fireEvent.press(view.getByText("Sign In"))

      expect(await view.findByText("Enter a valid email address")).toBeTruthy()
      expect(view.getByText("Enter your password")).toBeTruthy()
      expect(mockLogin).not.toHaveBeenCalled()
    })

    it("authenticates valid credentials and refreshes the auth context", async () => {
      mockLogin.mockResolvedValueOnce({ id: "user-1" } as never)
      const view = await render(<Login />)
      await fireEvent.changeText(view.getByPlaceholderText("Enter your email"), "member@example.com")
      await fireEvent.changeText(view.getByPlaceholderText("Enter your password"), "secret")
      await fireEvent.press(view.getByText("Sign In"))

      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalledWith("member@example.com", "secret")
        expect(mockRefreshAuth).toHaveBeenCalledTimes(1)
      })
      expect(mockToastShow).not.toHaveBeenCalled()
    })

    it("shows a failure message when login is rejected", async () => {
      mockLogin.mockRejectedValueOnce({ response: { data: { message: "Invalid credentials" } } })
      const view = await render(<Login />)
      await fireEvent.changeText(view.getByPlaceholderText("Enter your email"), "member@example.com")
      await fireEvent.changeText(view.getByPlaceholderText("Enter your password"), "wrong")
      await fireEvent.press(view.getByText("Sign In"))

      await waitFor(() => expect(mockToastShow).toHaveBeenCalledWith(expect.objectContaining({ textBody: "Invalid credentials" })))
      expect(mockRefreshAuth).not.toHaveBeenCalled()
    })

    it("reports connection failures without refreshing auth", async () => {
      mockLogin.mockRejectedValueOnce({ request: {} })
      const view = await render(<Login />)
      await fireEvent.changeText(view.getByPlaceholderText("Enter your email"), "member@example.com")
      await fireEvent.changeText(view.getByPlaceholderText("Enter your password"), "secret")
      await fireEvent.press(view.getByText("Sign In"))

      await waitFor(() =>
        expect(mockToastShow).toHaveBeenCalledWith(
          expect.objectContaining({ title: "Connection Problem", textBody: expect.stringContaining("Unable to connect") })
        )
      )
      expect(mockRefreshAuth).not.toHaveBeenCalled()
    })

    it("toggles password visibility from the input accessory", async () => {
      const view = await render(<Login />)
      expect(view.getByLabelText("Show password")).toBeTruthy()
      await fireEvent.press(view.getByLabelText("Show password"))
      expect(view.getByLabelText("Hide password")).toBeTruthy()
    })
  })

  describe("forgot password", () => {
    it("sends a reset request and carries the email into OTP verification", async () => {
      mockForgotPassword.mockResolvedValueOnce({ message: "sent" } as never)
      const view = await render(<ForgotPassword />)
      await fireEvent.changeText(view.getByPlaceholderText("you@example.com"), "member@example.com")
      await fireEvent.press(view.getByText("Send Verification Link & Code"))

      await waitFor(() => {
        expect(mockForgotPassword).toHaveBeenCalledWith("member@example.com")
        expect(mockRouterPush).toHaveBeenCalledWith({
          pathname: "/(auth)/otp",
          params: { email: "member@example.com" }
        })
      })
      expect(mockToastShow).toHaveBeenCalledWith(expect.objectContaining({ title: "OTP Code Sent" }))
    })

    it("does not submit an invalid email and displays service errors", async () => {
      const view = await render(<ForgotPassword />)
      await fireEvent.changeText(view.getByPlaceholderText("you@example.com"), "invalid")
      await fireEvent.press(view.getByText("Send Verification Link & Code"))

      expect(await view.findByText("Enter a valid email address")).toBeTruthy()
      expect(mockForgotPassword).not.toHaveBeenCalled()

      mockForgotPassword.mockRejectedValueOnce({ response: { data: { message: "Account not found" } } })
      await fireEvent.changeText(view.getByPlaceholderText("you@example.com"), "member@example.com")
      await fireEvent.press(view.getByText("Send Verification Link & Code"))
      await waitFor(() => expect(mockToastShow).toHaveBeenCalledWith(expect.objectContaining({ textBody: "Account not found" })))
    })
  })

  describe("OTP verification", () => {
    it("requires six digits before verifying and navigates after a valid code", async () => {
      mockOtpVerification.mockResolvedValueOnce({ data: { valid: true } } as never)
      const view = await render(<OtpResetPassword />)
      expect(view.getByText("Sent to: member@example.com")).toBeTruthy()

      await fireEvent.changeText(view.getByLabelText("OTP code"), "12345")
      await fireEvent.press(view.getByText("Verify and Continue"))
      expect(await view.findByText("OTP must be at least 6 digits")).toBeTruthy()
      expect(mockOtpVerification).not.toHaveBeenCalled()

      await fireEvent.changeText(view.getByLabelText("OTP code"), "123456")
      await fireEvent.press(view.getByText("Verify and Continue"))
      await waitFor(() => {
        expect(mockOtpVerification).toHaveBeenCalledWith("123456")
        expect(mockRouterPush).toHaveBeenCalledWith("/(auth)/reset-password")
      })
    })

    it("keeps resend unavailable during the cooldown", async () => {
      const view = await render(<OtpResetPassword />)
      expect(view.getByText("01:00")).toBeTruthy()
      expect(view.queryByLabelText("Resend code")).toBeNull()
      expect(mockForgotPassword).not.toHaveBeenCalled()
    })
  })

  describe("password reset", () => {
    it("validates password strength and matching confirmation before submitting", async () => {
      const view = await render(<ResetPassword />)
      await fireEvent.changeText(view.getByPlaceholderText("Enter a new password"), "weak")
      await fireEvent.changeText(view.getByPlaceholderText("Re-enter your password"), "different")
      await fireEvent.press(view.getByText("Save New Password"))

      expect(await view.findByText("At least 8 characters")).toBeTruthy()
      expect(mockResetPassword).not.toHaveBeenCalled()
    })

    it("resets a valid password and returns to login", async () => {
      mockResetPassword.mockResolvedValueOnce({ message: "updated" } as never)
      const view = await render(<ResetPassword />)
      await fireEvent.changeText(view.getByPlaceholderText("Enter a new password"), "StrongPass1!")
      await fireEvent.changeText(view.getByPlaceholderText("Re-enter your password"), "StrongPass1!")
      await fireEvent.press(view.getByText("Save New Password"))

      await waitFor(() => {
        expect(mockResetPassword).toHaveBeenCalledWith("StrongPass1!")
        expect(mockRouterPush).toHaveBeenCalledWith("/(auth)/login")
      })
      expect(mockToastShow).toHaveBeenCalledWith(expect.objectContaining({ title: "Success" }))
    })

    it("shows the backend error and stays on the reset screen", async () => {
      mockResetPassword.mockRejectedValueOnce({ response: { data: { message: "Expired reset code" } } })
      const view = await render(<ResetPassword />)
      await fireEvent.changeText(view.getByPlaceholderText("Enter a new password"), "StrongPass1!")
      await fireEvent.changeText(view.getByPlaceholderText("Re-enter your password"), "StrongPass1!")
      await fireEvent.press(view.getByText("Save New Password"))

      await waitFor(() => expect(mockToastShow).toHaveBeenCalledWith(expect.objectContaining({ textBody: "Expired reset code" })))
      expect(mockRouterPush).not.toHaveBeenCalled()
    })
  })
})
