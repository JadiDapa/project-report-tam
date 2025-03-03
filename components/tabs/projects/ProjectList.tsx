import React from "react";
import { Progress, ProgressFilledTrack } from "@/components/ui/progress";

import { useRouter } from "expo-router";
import { View, Text, FlatList, Pressable } from "react-native";
import Feather from "@expo/vector-icons/Feather";
export default function ProjectList() {
  const router = useRouter();
  const projects = [
    {
      id: 1,
      title: "Project 1",
      description: "Description of Project 1",
      progress: 10,
      priority: "high",
    },
    {
      id: 2,
      title: "Project 2",
      description: "Description of Project 2",
      progress: 40,
      priority: "medium",
    },
    {
      id: 3,
      title: "Project 3",
      description: "Description of Project 3",
      progress: 70,
      priority: "low",
    },
    {
      id: 4,
      title: "Project 4",
      description: "Description of Project 4",
      progress: 80,
      priority: "high",
    },
    {
      id: 5,
      title: "Project 5",
      description: "Description of Project 5",
      progress: 90,
      priority: "high",
    },
    {
      id: 6,
      title: "Project 6",
      description: "Description of Project 6",
      progress: 100,
      priority: "high",
    },
  ];
  return (
    <FlatList
      data={projects}
      className="px-6 border mt-9"
      keyExtractor={(project) => project.id.toString()}
      renderItem={({ item: project }) => (
        <Pressable
          onPress={() => router.push(`/`)}
          className="w-full p-4 mt-4 bg-white shadow-md rounded-xl"
        >
          <View className="flex-row justify-between">
            <Text className="text-lg font-cereal-bold">{project.title}</Text>
            <View className="items-center justify-center w-16 h-6 rounded-full bg-primary-100">
              <Text className="text-sm capitalize font-cereal-medium">
                {project.priority}
              </Text>
            </View>
          </View>
          <Text className="mt-1 text-sm font-cereal">
            {project.description}
          </Text>

          <Progress
            className="w-full mt-3"
            value={project.progress}
            size={"sm"}
          >
            <ProgressFilledTrack />
          </Progress>
          <View className="flex-row items-center gap-2 mt-3">
            <View className="flex-row items-center gap-1">
              <Feather name="calendar" size={16} color="" />
              <Text className="text-primary-800 font-cereal">
                Due {"30 Feb"}
              </Text>
            </View>
            <View className="rounded-full size-1 bg-primary-500" />
            <View className="flex-row items-center gap-1">
              <Feather name="users" size={16} color="" />
              <Text className="text-primary-800 font-cereal">
                {"8"} Employee
              </Text>
            </View>
          </View>
        </Pressable>
      )}
    />
  );
}
