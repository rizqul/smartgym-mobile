import { AuthButton } from "@/components/auth/authButton"
import { AuthScreenLayout } from "@/components/auth/authScreenLayout"
import { AuthTextField } from "@/components/auth/authTextField"
import { OrangeGlowBackground } from "@/components/auth/OrangeGlowBackground"
import { ForgotPassword as forgotPassword } from "@/service/auth.service"
import { Fontisto } from "@expo/vector-icons"
import MaterialIcons from "@expo/vector-icons/MaterialIcons"
import { zodResolver } from "@hookform/resolvers/zod"
import { Link, router } from "expo-router"
import { Controller, useForm } from "react-hook-form"
import { Text, View } from "react-native"
import { ALERT_TYPE, Toast } from "react-native-alert-notification"
import { z } from "zod"

const forgotPasswordSchema = z.object({
  email: z.email("Masukkan alamat email yang valid")
})

type FormValues = z.infer<typeof forgotPasswordSchema>

export default function ForgotPassword() {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<FormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" }
  })

  const onSubmit = async (data: FormValues) => {
    try {
      await forgotPassword(data.email)
      router.push({
        pathname: "/(auth)/otp",
        params: { email: data.email }
      })
      Toast.show({
        type: ALERT_TYPE.SUCCESS,
        title: "Kode OTP Terkirim",
        textBody: `Silahkan periksa email ${data.email} untuk kode verifikasi.`
      })
    } catch (error: any) {
      console.log("Error :" + error)

      const message = error.response?.data?.message || "Gagal mengirim kode. Coba lagi."

      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: "Gagal",
        textBody: message,
        autoClose: 3000
      })
    }
  }

  return (
    <AuthScreenLayout>
      <OrangeGlowBackground style={{ position: "absolute", top: -210, left: 0, right: 0, bottom: 0 }} />

      <View className="mx-auto w-full max-w-[385px] justify-start gap-6 px-5">
        {/* Header */}
        <View className="flex items-center justify-center gap-5">
          {/* logo part */}
          <View className="flex h-[96] w-[96] items-center justify-center rounded-2xl  bg-white/10 shadow-xl">
            <View className="opacity-120 flex h-[76] w-[76] items-center justify-center rounded-full border border-dashed border-[#FF6B00]">
              <MaterialIcons
                name="lock-reset"
                size={40}
                color="#FF6B00"
              />
            </View>
          </View>

          {/* Title and Description part */}
          <View className="flex w-[340] items-center justify-center gap-3">
            <Text className="text-3xl font-bold text-text-body">Lupa Kata Sandi?</Text>
            <Text className="w-full text-center text-sm leading-6 text-[#E2BFB0]">
              Jangan khawatir! Kirim Email yang terdaftar di akun <Text className="font-bold text-[#FFB693]">SmartGym</Text> kamu untuk
              mereset kata sandi.
            </Text>
          </View>
        </View>
        {/* Input Part */}
        <View className="flex">
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
                placeholder="you@example.com"
                error={errors.email?.message}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            )}
          />
        </View>
        <View>
          <AuthButton
            onPress={handleSubmit(onSubmit)}
            label="Kirim Tautan & Kode Verifikasi"
          />
        </View>
        <View className="flex items-center">
          <Text className="text-sm text-[#E2BFB0]">
            Ingat kata sandi?{" "}
            <Link href={"/(auth)/login"}>
              <Text className="font-semibold text-[#FFB693]">Kembali ke Halaman Masuk</Text>
            </Link>{" "}
          </Text>
        </View>
      </View>
    </AuthScreenLayout>
  )
}
