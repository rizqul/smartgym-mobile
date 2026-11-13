import React, { ReactNode } from "react";
import { KeyboardTypeOptions, Text, TextInput, TextInputProps, View } from "react-native";

type AuthTextFieldProps = {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  onBlur?: () => void;
  placeholder: string;
  error?: string;
  keyboardType?: KeyboardTypeOptions;
  autoCapitalize?: TextInputProps["autoCapitalize"];
  secureTextEntry?: boolean;
  accessory?: ReactNode;
  icon: React.ReactElement
};

export function AuthTextField({ label, value, onChangeText, onBlur, placeholder, error, keyboardType, autoCapitalize = "sentences", secureTextEntry, accessory, icon }: AuthTextFieldProps) {
  return (
    <View className="mb-5">
      <View className="flex-row gap-3">
        {icon}
        <Text className="mb-2 text-sm font-semibold text-slate-700">{label}</Text>
      </View>
      <View className={`flex-row items-center rounded-xl border bg-slate-50 px-4 ${error ? "border-red-500" : "border-slate-200"}`}>
        <TextInput
          className="min-h-12 flex-1 text-base text-slate-900"
          value={value}
          onChangeText={onChangeText}
          onBlur={onBlur}
          placeholder={placeholder}
          placeholderTextColor="#94A3B8"
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoCorrect={false}
          secureTextEntry={secureTextEntry}
        />
        {accessory}
      </View>
      {error ? <Text className="mt-1 text-xs text-red-600">{error}</Text> : null}
    </View>
  );
}