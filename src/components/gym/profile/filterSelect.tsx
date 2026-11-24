import { FilterOption } from "@/data/helperTransaction/transactionFilter"
import { Ionicons } from "@expo/vector-icons"
import React, { useState } from "react"
import { Modal, Pressable, Text, TouchableOpacity, View } from "react-native"

type Props<T extends string> = {
  title: string
  value: T
  options: FilterOption<T>[]
  onChange: (value: T) => void
  isActive?: boolean
  icon?: React.ComponentProps<typeof Ionicons>["name"]
  compact?: boolean
  className?: string
}

export function FilterSelect<T extends string>({
  title,
  value,
  options,
  onChange,
  isActive = false,
  icon,
  compact = false,
  className = ""
}: Props<T>) {
  const [open, setOpen] = useState(false)
  const selected = options.find((o) => o.value === value)

  return (
    <>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => setOpen(true)}
        className={`flex-row items-center gap-2 rounded-xl border px-3 py-2.5 ${compact ? "self-center" : "justify-between"} ${
          isActive ? "border-primary/60 bg-primary/10" : "border-border/50 bg-surface"
        } ${className}`}
      >
        <View className={`flex-row items-center gap-2 ${compact ? "" : "flex-1"}`}>
          {icon ? (
            <Ionicons
              name={icon}
              size={14}
              color={isActive ? "#FF6B00" : "#B8BDC7"}
            />
          ) : null}
          <Text
            numberOfLines={1}
            className={`font-inter text-sm font-semibold ${isActive ? "text-primary" : "text-text-primary"}`}
          >
            {selected?.label}
          </Text>
        </View>
        <Ionicons
          name="chevron-down"
          size={14}
          color={isActive ? "#FF6B00" : "#B8BDC7"}
        />
      </TouchableOpacity>

      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => setOpen(false)}
      >
        <Pressable
          className="flex-1 justify-end bg-black/60"
          onPress={() => setOpen(false)}
        >
          <Pressable className="rounded-t-3xl border-t border-border/50 bg-card px-5 pb-10 pt-5">
            <View className="mb-4 flex-row items-center justify-between">
              <Text className="font-inter text-base font-bold text-text-primary">{title}</Text>
              <TouchableOpacity onPress={() => setOpen(false)}>
                <Ionicons
                  name="close"
                  size={22}
                  color="#B8BDC7"
                />
              </TouchableOpacity>
            </View>

            {options.map((opt) => {
              const checked = opt.value === value
              return (
                <TouchableOpacity
                  key={opt.value}
                  activeOpacity={0.7}
                  onPress={() => {
                    onChange(opt.value)
                    setOpen(false)
                  }}
                  className="flex-row items-center justify-between border-b border-border/30 py-3.5"
                >
                  <Text className={`font-inter text-sm ${checked ? "font-bold text-primary" : "font-medium text-text-primary"}`}>
                    {opt.label}
                  </Text>
                  {checked ? (
                    <Ionicons
                      name="checkmark"
                      size={18}
                      color="#FF6B00"
                    />
                  ) : null}
                </TouchableOpacity>
              )
            })}
          </Pressable>
        </Pressable>
      </Modal>
    </>
  )
}
