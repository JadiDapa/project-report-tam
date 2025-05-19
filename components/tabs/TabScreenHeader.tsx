import { View, Text } from "react-native";
import React from "react";
import Feather from "@expo/vector-icons/Feather";

export default function TabScreenHeader({ title }: { title: string }) {
  return (
    <View className="flex flex-row items-center justify-between px-6 pt-8 pb-4 bg-primary-500">
      <View className="items-center justify-center text-white border border-white rounded-full size-10 ">
        <Text className="text-white font-cereal-bold">DP</Text>
      </View>
      <Text className="text-xl text-white font-cereal-medium">{title}</Text>
      <View className="items-center justify-center border border-white rounded-full size-10 ">
        <Feather name="bell" size={20} color="#fff" />
      </View>
    </View>
  );
}
