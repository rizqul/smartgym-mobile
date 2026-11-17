import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons"
import { Image, Text, TouchableOpacity, View } from "react-native"

export const TrainerCard = ({ data, handleShow }: { data: any; handleShow: (id: string) => void }) => {
  const { name, image, specialty, exp, clients, available, schedule } = data

  return (
    <View className={`gap-3 rounded-2xl border border-border/50 bg-card p-4 ${!available ? "opacity-60" : ""}`}>
      <View className="flex-row items-start gap-4">
        <Image
          source={{ uri: image }}
          className="h-24 w-20 rounded-xl border border-border/50 bg-surface"
          resizeMode="cover"
        />
        <View className="flex-1 justify-start gap-1.5">
          <Text
            className="text-lg font-bold leading-tight text-text-primary"
            style={{ includeFontPadding: false }}
          >
            {name}
          </Text>

          <View className="self-start rounded-md bg-primary/10 px-2 py-1">
            <Text className="text-[10px] font-semibold text-primary">{specialty}</Text>
          </View>

          <View className="flex-row items-center gap-3">
            <View className="flex-row items-center gap-1">
              <Ionicons
                name="time-outline"
                size={12}
                color="#B8BDC7"
              />
              <Text className="text-xs text-text-secondary">{exp}</Text>
            </View>
            <View className="flex-row items-center gap-1">
              <Ionicons
                name="people-outline"
                size={12}
                color="#B8BDC7"
              />
              <Text className="text-xs text-text-secondary">{clients}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Status & Schedule */}
      <View className="flex-row items-center justify-between border-t border-border/30">
        <View className="flex-row items-center gap-1.5">
          <View className={`h-2 w-2 rounded-full ${available ? "bg-success" : "bg-danger"}`} />
          <Text className={`text-xs font-bold ${available ? "text-success" : "text-danger"}`}>
            {available ? "AVAILABLE" : "UNAVAILABLE"}
          </Text>
        </View>
        <Text className="text-xs text-text-secondary">{schedule}</Text>
      </View>

      {/* Action Button */}
      <TouchableOpacity
        className={`flex-row items-center justify-center gap-2 rounded-xl py-3.5 ${
          available ? "bg-primary" : "border border-border bg-surface"
        }`}
        onPress={() => handleShow(name as string)}
      >
        {!available && (
          <MaterialCommunityIcons
            name="calendar-clock"
            size={16}
            color="#B8BDC7"
          />
        )}
        <Text className={`text-sm font-bold ${available ? "text-white" : "text-text-primary"}`}>Lihat Jadwal & Booking</Text>
        {available && (
          <Ionicons
            name="arrow-forward"
            size={16}
            color="white"
          />
        )}
      </TouchableOpacity>
    </View>
  )
}
