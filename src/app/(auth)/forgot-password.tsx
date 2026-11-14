import { AuthButton } from "@/components/auth/authButton"
import { AuthScreenLayout } from "@/components/auth/authScreenLayout"
import { AuthTextField } from "@/components/auth/authTextField"
import { Fontisto } from "@expo/vector-icons"
import MaterialIcons from "@expo/vector-icons/MaterialIcons"
import { zodResolver } from "@hookform/resolvers/zod"
import { Link, router } from "expo-router"
import { Controller, useForm } from "react-hook-form"
import { Text, View } from "react-native"
import { Defs, RadialGradient, Rect, Stop, Svg } from "react-native-svg"
import { z } from "zod"

const forgotPasswordSchema = z.object({
  email: z.email("Enter a valid email address")
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
    router.push("/(auth)/otp")
  }

  return (
    <AuthScreenLayout>
      <Svg
        width="100%"
        height="100%"
        style={{ position: "absolute", top: -220, left: 0, right: 0, bottom: 0 }}
      >
        <Defs>
          <RadialGradient
            id="orangeGlow"
            cx="50%"
            cy="52%"
            rx="70%"
            ry="30%"
            fx="50%"
            fy="52%"
          >
            <Stop
              offset="0%"
              stopColor="#FF6B00"
              stopOpacity="0.28"
            />
            <Stop
              offset="50%"
              stopColor="#7A3300"
              stopOpacity="0.14"
            />
            <Stop
              offset="100%"
              stopColor="#121215"
              stopOpacity="0"
            />
          </RadialGradient>
        </Defs>
        <Rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          fill="url(#orangeGlow)"
        />
      </Svg>
      <View className="flex items-center justify-start gap-8">
        {/* Header */}
        <View className="flex w-[358] items-center justify-center gap-5">
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
              Jangan khawatir! Pilih metode pemulihan yang terdaftar di akun <Text className="font-bold text-[#FFB693]">SmartGym</Text> kamu
              untuk mereset kata sandi.
            </Text>
          </View>
        </View>
        {/* Input Part */}
        <View className="flex">
          <View>
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
        </View>
        <View>
          <AuthButton
            onPress={handleSubmit(onSubmit)}
            label="Kirim Tautan & Kode Verifikasi"
          />
        </View>
        <View>
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
