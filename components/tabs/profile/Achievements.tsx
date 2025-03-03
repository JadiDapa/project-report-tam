import { View, Text, SafeAreaView, FlatList } from "react-native";
import React from "react";
import HabitCard from "../home/HabitCard";
import { habits } from "@/app/(root)/(tabs)";
import AntDesign from "@expo/vector-icons/AntDesign";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function Achievements() {
  return (
    <FlatList
      data={habits}
      numColumns={2}
      className="p-4"
      renderItem={({ item: habit }) => <HabitCard habit={habit} />}
      showsVerticalScrollIndicator={false}
      keyExtractor={(item) => item.name}
      ListHeaderComponent={() => (
        <View className="flex-row items-center justify-between">
          <Text className="font-cereal-medium">Your Achievements</Text>
          <View className="flex-row gap-2">
            <View className="flex items-center justify-center bg-white border rounded-lg size-10 border-slate-200">
              <AntDesign name="eyeo" size={18} color="black" />
            </View>
          </View>
        </View>
      )}
    />
  );
}
