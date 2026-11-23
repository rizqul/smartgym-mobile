import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"
import { Text, TouchableOpacity, View } from "react-native"

const COLOR_PRIMARY = "#FF7A00"

export const TrainerCard = ({ onViewTrainer }: { onViewTrainer: () => void }) => {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onViewTrainer}
    >
      <LinearGradient
        colors={["#2E1A14", "#1A1D24", "#1A1D24"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="overflow-hidden rounded-[20px] border border-border"
        style={{ padding: 18, borderRadius: 20 }}
      >
        {/* Header */}
        <View className="mb-4 flex-row items-center justify-between">
          <View className="flex-row items-center gap-2.5">
            <MaterialCommunityIcons
              name="account-tie"
              size={24}
              color={COLOR_PRIMARY}
            />
            <Text className="text-base font-bold text-text-primary">Personal Trainer</Text>
          </View>

          <View className="flex-row items-center gap-1">
            <Text className="text-xs font-semibold text-primary">View All</Text>
            <Ionicons
              name="arrow-forward"
              size={14}
              color={COLOR_PRIMARY}
            />
          </View>
        </View>

        {/* Body */}
        <View className="items-center px-2 pb-1">
          <View className="mb-3 h-16 w-16 items-center justify-center rounded-full border border-primary/30 bg-primary/10">
            <MaterialCommunityIcons
              name="human-greeting-variant"
              size={34}
              color={COLOR_PRIMARY}
            />
          </View>
          <Text className="text-lg font-bold text-text-primary">Find your perfect trainer</Text>
          <Text className="mb-4 mt-1 text-center text-sm leading-5 text-text-subdued">
            Get guided by professionals and reach your fitness goals faster!
          </Text>

          {/* Button (visual only, seluruh card sudah bisa diklik) */}
          <View className="w-full flex-row items-center justify-center gap-2 rounded-full bg-primary py-3.5">
            <Ionicons
              name="people"
              size={18}
              color="#1A1C20"
            />
            <Text className="text-sm font-bold text-background">Explore Trainers</Text>
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  )
}