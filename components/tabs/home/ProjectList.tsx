import React, { useEffect } from "react";
import { Progress, ProgressFilledTrack } from "@/components/ui/progress";

import { useRouter } from "expo-router";
import { View, Text, FlatList, Pressable } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { useQuery } from "@tanstack/react-query";
import { getAllProjects } from "@/lib/network/project";
import { useAuth } from "@clerk/clerk-expo";

interface ProjectListProps {
  refreshing: boolean;
}

export default function ProjectList({ refreshing }: ProjectListProps) {
  const { getToken } = useAuth();

  const { data: projects, refetch } = useQuery({
    queryFn: () => getAllProjects(getToken),
    queryKey: ["projects"],
  });

  useEffect(() => {
    if (refreshing) {
      refetch();
    }
  }, [refreshing, refetch]);

  const router = useRouter();

  return (
    <View className="mt-9">
      {/* Header placed separately */}
      <View className="flex-row items-center justify-between px-6">
        <Text className="text-lg font-cereal-medium">Recent Projects</Text>
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
        renderItem={({ item: project }) => (
          <Pressable
            onPress={() =>
              router.push({
                pathname: "/project/[id]",
                params: { id: project.id },
              })
            }
            className="p-4 me-3 bg-white shadow-md w-[300px] rounded-xl"
          >
            <View className="flex-row justify-between">
              <Text className="text-lg font-cereal-bold">{project.title}</Text>
              <View className="items-center justify-center w-16 h-6 rounded-full bg-primary-100">
                <Text className="text-sm capitalize font-cereal-medium">
                  {project.status}
                </Text>
              </View>
            </View>
            <Text className="mt-1 text-sm font-cereal">
              {project.description}
            </Text>

            <Progress
              className="w-full mt-3"
              value={Math.random() * 100}
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
    </View>
  );
}
