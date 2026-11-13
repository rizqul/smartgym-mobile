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
        <Text className="mb-2 text-sm font-semibold text-text-body">{label}</Text>
      </View>
      <View className={`flex-row items-center rounded-xl border bg-field-primary px-4 ${error ? "border-danger" : "border-slate-200"}`}>
        <TextInput
          className="min-h-12 flex-1 text-base text-text-body"
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
  );
}