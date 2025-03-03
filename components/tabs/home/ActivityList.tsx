import React from "react";
import { useRouter } from "expo-router";
import { View, Text, FlatList, Pressable } from "react-native";
import Foundation from "@expo/vector-icons/Foundation";

export default function ActivityList() {
  const router = useRouter();
  const projects = [
    {
      id: 1,
      username: "Daffa AR",
      project: "Pemasangan CCTV Polda",
      description: "Memasang CCTV di polda  20 unit di 4 titik wara were",
      progress: 10,
      priority: "high",
    },
    {
      id: 2,
      username: "Daffa AR",
      project: "Project 2",
      description: "Memasang CCTV di polda  20 unit di 4 titik wara were",
      progress: 40,
      priority: "medium",
    },
    {
      id: 3,
      username: "Daffa AR",
      project: "Project 3",
      description: "Memasang CCTV di polda  20 unit di 4 titik wara were",
      progress: 70,
      priority: "low",
    },
    {
      id: 4,
      username: "Daffa AR",
      project: "Project 4",
      description: "Memasang CCTV di polda  20 unit di 4 titik wara were",
      progress: 80,
      priority: "high",
    },
  ];
  return (
    <View className="mt-6">
      {/* Header placed separately */}
      <View className="flex-row items-center justify-between px-6">
        <Text className="text-lg font-cereal-medium">Recent Activities</Text>
        <View className="border rounded-full px-3 py-0.5">
          <Text className="text-sm font-cereal-medium">View All</Text>
        </View>
      </View>

      <FlatList
        data={projects}
        horizontal
        className="mt-2 ps-6"
        showsHorizontalScrollIndicator={false}
        keyExtractor={(project) => project.id.toString()}
        renderItem={({ item: activity }) => (
          <Pressable
            onPress={() => router.push(`/`)}
            className="flex-row items-center w-64 h-32 gap-2 p-4 mr-3 bg-white shadow-md rounded-xl"
          >
            <View className="justify-between flex-1 h-full">
              <View className="">
                <Text className="text-sm text-primary-500 font-cereal-medium line-clamp-1">
                  Project : {activity.project}
                </Text>
                <Text className=" mt-0.5 text-sm font-cereal text-slate-700 line-clamp-2">
                  {activity.description}
                </Text>
              </View>
              <View className="flex-row items-center justify-between gap-1">
                <View className="flex-row items-center gap-1">
                  <View className="items-center justify-center border rounded-full border-slate-400 size-5">
                    <Text className="text-[10px] text-slate-500 font-cereal-medium">
                      DP
                    </Text>
                  </View>
                  <Text className="text-sm text-primary-500 font-cereal-medium">
                    {activity.username}
                  </Text>
                </View>

                <Text className="text-xs text-slate-500 font-cereal">
                  {"3 Hours Ago"}
                </Text>
              </View>
            </View>
          </Pressable>
        )}
      />
    </View>
  );
}
