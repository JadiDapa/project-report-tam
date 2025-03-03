import { View, Text, Image } from "react-native";
import { chevronRight, searchIcon } from "@/constants/Images";

export default function DiscoverHeader() {
  return (
    <View className="flex-row items-center justify-between gap-4 p-4 bg-white shadow-md">
      <Text className="text-xl font-cereal-medium">Discover</Text>
      <View className="relative items-center justify-center border border-slate-300 size-12 rounded-xl">
        <Image source={searchIcon} className=" size-5 opacity-60" />
      </View>
    </View>
  );
}
