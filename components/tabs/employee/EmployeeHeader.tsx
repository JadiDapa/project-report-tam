import { View, Text } from "react-native";
import React from "react";
import Feather from "@expo/vector-icons/Feather";

export default function EmployeeHeader() {
  return (
    <View className="flex flex-row items-center justify-between px-6">
      <View className="items-center justify-center border rounded-full border-slate-400 size-10 ">
        <Text className="text-slate-500 font-cereal-bold">DP</Text>
      </View>
      <Text className="text-xl font-cereal-medium">Employee List</Text>
      <View className="items-center justify-center border rounded-full border-slate-400 size-10 ">
        <Feather name="bell" size={24} color="#57595f" />
      </View>
    </View>
  );
}
