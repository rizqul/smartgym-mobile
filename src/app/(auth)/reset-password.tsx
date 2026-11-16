import { AuthButton } from "@/components/auth/authButton"
import { AuthScreenLayout } from "@/components/auth/authScreenLayout"
import { AuthTextField } from "@/components/auth/authTextField"
import { Entypo } from "@expo/vector-icons"
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons"
import { zodResolver } from "@hookform/resolvers/zod"
import React, { useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { Pressable, Text, View } from "react-native"
import { Defs, RadialGradient, Rect, Stop, Svg } from "react-native-svg"
import { z } from "zod"

const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Panjang minimal 8 karakter")
      .regex(/[A-Z]/, "Minimal ada 1 huruf kapital")
      .regex(/[a-z]/, "Minimal ada 1 huruf kecil")
      .regex(/[0-9]/, "Minimal ada 1 angka")
      .regex(/[!@#$%^&*()_+]/, "Minimal memiliki 1 karakter dari !@#$%^&*()_+"),
    confirmPassword: z.string()
  })
  .refine((data) => data.confirmPassword === data.password, {
    message: "Kata Sandi Tidak Sama"
  })

type FormValues = z.infer<typeof resetPasswordSchema>

const resetPassword = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<FormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" }
  })

  const onSubmit = async(data: FormValues) => {

  }

  return (
    <AuthScreenLayout>
      <Svg
        width="100%"
        height="100%"
        style={{ position: "absolute", top: -310, left: 0, right: 0, bottom: 0 }}
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
          <View className="h-[96] w-[96] flex-row items-center justify-center rounded-2xl  bg-white/10 shadow-xl">
            <MaterialCommunityIcons
              name="cellphone-check"
              size={50}
              color="#FF6B00"
            />
          </View>

          {/* Title and Description part */}
          <View className="flex w-[340] items-center justify-center gap-3">
            <View className="flex w-[340] items-center justify-center gap-3">
              <Text className="text-3xl font-bold text-text-body">Reset Password</Text>
            </View>
          </View>
        </View>

        {/* Input Part */}
        <View className="flex items-center gap-5">
          <View>
            <Controller
              control={control}
              name="password"
              render={({ field: { value, onChange, onBlur } }) => (
                <AuthTextField
                  label="Kata Sandi"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholder="Masukkan Kata Sandi Baru"
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
          <View>
            <Controller
              control={control}
              name="confirmPassword"
              render={({ field: { value, onChange, onBlur } }) => (
                <AuthTextField
                  label="Konfirmasi Kata Sandi"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholder="Masukkan Kata Sandi"
                  error={errors.confirmPassword?.message}
                  secureTextEntry={!showPassword}
                  accessory={
                    <Pressable
                      className="p-2"
                      onPress={() => setShowConfirmPassword((visible) => !visible)}
                      accessibilityLabel={showConfirmPassword ? "Hide password" : "Show password"}
                    >
                      <Entypo
                        name={showConfirmPassword ? "eye-with-line" : "eye"}
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
          <AuthButton label="Verifikasi dan Lanjutkan" />
        </View>
      </View>
    </AuthScreenLayout>
  )
}

export default resetPassword
