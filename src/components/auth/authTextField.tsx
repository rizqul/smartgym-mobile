import { Link } from "expo-router"
import React, { ReactNode } from "react"
import { KeyboardTypeOptions, Text, TextInput, TextInputProps, View } from "react-native"

type AuthTextFieldProps = {
  label: string
  value: string
  onChangeText: (value: string) => void
  onBlur?: () => void
  placeholder: string
  error?: string
  keyboardType?: KeyboardTypeOptions
  autoCapitalize?: TextInputProps["autoCapitalize"]
  secureTextEntry?: boolean
  accessory?: ReactNode
  icon?: React.ReactElement
  label2?: string
}

export function AuthTextField({
  label,
  value,
  onChangeText,
  onBlur,
  placeholder,
  error,
  keyboardType,
  autoCapitalize = "sentences",
  secureTextEntry,
  accessory,
  label2,
  icon
}: Readonly<AuthTextFieldProps>) {
  return (
    <View className="">
      <View className="flex-row items-center justify-between">
        <View className="flex-row gap-2 px-2">
          {icon}
          <Text className="mb-2 font-inter text-sm font-semibold text-text-body">{label}</Text>
        </View>
        {label2 && (
          <View>
            <Link href={"/(auth)/forgot-password"}>
              <Text className="mb-2 font-inter text-sm font-semibold text-primary">{label2}</Text>
            </Link>
          </View>
        )}
      </View>
      <View className={`w-full flex-row items-center rounded-xl border bg-field-primary px-4 py-1 ${error ? "border-danger" : ""}`}>
        <TextInput
          // min-h-14
          className=" flex-1 font-inter text-base text-text-body"
          value={value}
          onChangeText={onChangeText}
          onBlur={onBlur}
          placeholder={placeholder}
          placeholderTextColor="#A98A7D"
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoCorrect={false}
          secureTextEntry={secureTextEntry}
        />
        {accessory}
      </View>
      {error ? <Text className="mt-1 text-xs text-danger">{error}</Text> : null}
    </View>
  )
}
