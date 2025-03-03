import { View, Text } from "react-native";
import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react-native";

export default function ReportHeader() {
  return (
    <View className="flex flex-row items-center justify-between px-6">
      <View className="items-center justify-center rounded-xl bg-slate-400 size-10 ">
        <ChevronLeft size={24} color="#ffffff" />
      </View>
      <Text className="text-xl font-cereal-medium">Report Detail</Text>
      <View className="items-center justify-center rounded-xl bg-slate-400 size-10 ">
        <ChevronRight size={24} color="#ffffff" />
      </View>
    </View>
  );
}
