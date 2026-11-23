import { AuthButton } from "@/components/auth/authButton"
import { AuthScreenLayout } from "@/components/auth/authScreenLayout"
import { AuthTextField } from "@/components/auth/authTextField"
import { OrangeGlowBackground } from "@/components/auth/OrangeGlowBackground"
import { useAuth } from "@/context/AuthContext"
import { login } from "@/service/auth.service"
import { Entypo, Ionicons } from "@expo/vector-icons"
import Fontisto from "@expo/vector-icons/Fontisto"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { Image, Pressable, Text, View } from "react-native"
import { ALERT_TYPE, Toast } from "react-native-alert-notification"
import { z } from "zod"

const loginSchema = z.object({
  email: z.email("Enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters")
})

type FormValues = z.infer<typeof loginSchema>

export default function Login() {
  const [showPassword, setShowPassword] = useState(false)
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<FormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" }
  })
  const { refreshAuth } = useAuth()

  const onSubmit = async (formValue: FormValues) => {
    try {
      await login(formValue.email, formValue.password)

      await refreshAuth()
    } catch (error: any) {
      console.log("=== LOGIN GAGAL ===")

      if (error.request && !error.response) {
        let errorMessage = "Terjadi kesalahan yang tidak diketahui"
        let errorTitle = "Login Gagal"

        if (error.request && !error.response) {
          errorTitle = "Koneksi Bermasalah"
          errorMessage = "Tidak dapat terhubung ke server. Pastikan internet Anda menyala dan server dapat diakses."
        }
        else if (error.response) {
          errorMessage = error.response.data?.message || "Terjadi kesalahan pada server"
        }
        else {
          errorMessage = error.message
        }

        Toast.show({
          type: ALERT_TYPE.DANGER,
          title: errorTitle,
          textBody: errorMessage,
          autoClose: 3000
        })
      }
    }
  }

  return (
    <AuthScreenLayout>
      <OrangeGlowBackground style={{ position: "absolute", top: -320, left: 0, right: 0, bottom: 0 }} />

      {/* Header */}
      <View className="mx-auto w-full max-w-[385px] gap-14 px-5">
        <View className="flex items-center justify-center gap-5">
          {/* logo part */}
          <View className="flex h-[70] w-[70] items-center justify-center rounded-xl bg-[#231105]">
            <Image
              source={require("../../../assets/images/logo.png")}
              className="h-[60] w-[60] rounded-xl"
            />
          </View>

          {/* Title and Description part */}
          <View className="flex items-center justify-center ">
            <Text className="font-inter text-2xl font-extrabold text-text-body">
              SMART<Text className=" font-extrabold text-primary">GYM</Text>
            </Text>
            <Text className="text-sm text-[#E2BFB0]">Smart Fitness & IoT Connected Gym</Text>
          </View>
        </View>
        {/* Welcome Part */}
        <View className="flex items-center justify-center gap-3 font-inter">
          <Text className="font-inter text-3xl font-bold text-text-body">Selamat Datang</Text>
          <Text className="text-md w-full text-center font-inter leading-6 text-[#E2BFB0]">
            Masuk ke akun SmartGym kamu untuk melanjutkan sesi latihan dan akses fasilitas gym pintar.
          </Text>
        </View>
        {/* Input Part */}
        <View className="flex">
          <View className="gap-5">
            <Controller
              control={control}
              name="email"
              render={({ field: { value, onChange, onBlur } }) => (
                <AuthTextField
                  icon={
                    <Fontisto
                      name="email"
                      size={15}
                      color="#FF6B00"
                    />
                  }
                  label="Email"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholder="Masukkan Email Anda"
                  error={errors.email?.message}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              )}
            />
            <Controller
              control={control}
              name="password"
              render={({ field: { value, onChange, onBlur } }) => (
                <AuthTextField
                  icon={
                    <Ionicons
                      name="lock-closed-outline"
                      size={15}
                      color="#FF6B00"
                    />
                  }
                  label2="Lupa Password?"
                  label="Kata Sandi"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholder="Masukkan Sandi Anda"
                  error={errors.password?.message}
                  secureTextEntry={!showPassword}
                  accessory={
                    <Pressable
                      className="p-2"
                      onPress={() => setShowPassword((visible) => !visible)}
                      accessibilityLabel={showPassword ? "Hide password" : "Show password"}
                    >
                      <Entypo
                        name={showPassword ? "eye-with-line" : "eye"}
                        size={20}
                        color="#E2BFB0"
                      />
                    </Pressable>
                  }
                />
              )}
            />
          </View>
        </View>
        <View>
          <AuthButton
            onPress={handleSubmit(onSubmit)}
            label="Masuk Sekarang"
          />
        </View>
      </View>
    </AuthScreenLayout>
  )
}
