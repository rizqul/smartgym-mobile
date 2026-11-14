import { AuthButton } from "@/components/auth/authButton"
import { AuthScreenLayout } from "@/components/auth/authScreenLayout"
import { AuthTextField } from "@/components/auth/authTextField"
import { Entypo, Ionicons } from "@expo/vector-icons"
import Fontisto from "@expo/vector-icons/Fontisto"
import { zodResolver } from "@hookform/resolvers/zod"
import { router } from "expo-router"
import { useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { Image, Pressable, Text, View } from "react-native"
import Svg, { Defs, RadialGradient, Rect, Stop } from "react-native-svg"
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

  const onSubmit = (data: FormValues) => {
    router.push("/(gym)/dashboard")
  }

  return (
    <AuthScreenLayout>
      <Svg
        width="100%"
        height="100%"
        style={{ position: "absolute", top: -320, left: 0, right: 0, bottom: 0 }}
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
      {/* Header */}
      <View className="flex w-[358] items-center justify-center gap-5">
        {/* logo part */}
        <View className="flex h-[70] w-[70] items-center justify-center rounded-xl bg-[#231105]">
          <Image
            source={require("../../../assets/images/logo.png")}
            className="h-[60] w-[60] rounded-xl"
          />
        </View>

        {/* Title and Description part */}
        <View className="flex items-center justify-center ">
          <Text className="font-inter text-xl font-extrabold text-text-body">
            SMART<Text className="text-xl font-extrabold text-primary">GYM</Text>
          </Text>
          <Text className="text-xs text-[#E2BFB0]">Smart Fitness & IoT Connected Gym</Text>
        </View>
      </View>
      {/* Welcome Part */}
      <View className="flex w-[340] items-center justify-center gap-3">
        <Text className="text-3xl font-bold text-text-body">Selamat Datang</Text>
        <Text className="text-md w-full text-center leading-6 text-[#E2BFB0]">
          Masuk ke akun SmartGym kamu untuk melanjutkan sesi latihan dan akses fasilitas gym pintar.
        </Text>
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
                placeholder="anda@email.com"
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
    </AuthScreenLayout>
  )
}
