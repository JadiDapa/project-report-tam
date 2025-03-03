import { View, Text, Image } from "react-native";
import { chevronRight } from "@/constants/Images";

export default function CreateHeader() {
  return (
    <View className="flex-row items-center gap-4 p-4 bg-white shadow-md">
      <View className="relative items-center justify-center border border-slate-300 size-12 rounded-xl">
        <Image source={chevronRight} className="rotate-180 size-5 opacity-60" />
      </View>

      <Text className="text-xl font-cereal-medium">Create New Habit</Text>
    </View>
  );
}
