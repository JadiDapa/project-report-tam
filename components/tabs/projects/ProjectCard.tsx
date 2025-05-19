import { View, Text, Pressable } from "react-native";
import React from "react";
import { ProjectType } from "@/lib/types/project";
import { router } from "expo-router";
import { Progress, ProgressFilledTrack } from "@/components/ui/progress";
import Feather from "@expo/vector-icons/Feather";
import { format } from "date-fns";

export default function ProjectCard({ project }: { project: ProjectType }) {
  return (
    <View className="px-6 mt-4 ">
      <Pressable
        onPress={() =>
          router.push({
            pathname: "/project/[id]",
            params: { id: project.id },
          })
        }
        className="w-full p-4 bg-white shadow-md rounded-xl"
      >
        <View className="flex-row justify-between ">
          <Text className="flex-1 text-lg line-clamp-2 font-cereal-bold">
            {project.title}
          </Text>
          <View className="items-center justify-center w-16 h-6 rounded-full bg-primary-100">
            <Text className="text-sm capitalize font-cereal-medium">
              {project.status}
            </Text>
          </View>
        </View>
        <Text className="mt-1 text-sm font-cereal line-clamp-2">
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
              Due{" "}
              {project.endDate
                ? format(project.endDate, "dd MMMM yyyy")
                : " - "}
            </Text>
          </View>
          <View className="rounded-full size-1 bg-primary-500" />
          <View className="flex-row items-center gap-1">
            <Feather name="users" size={16} color="" />
            <Text className="text-primary-800 font-cereal">{0} Employees</Text>
          </View>
        </View>
      </Pressable>
    </View>
  );
}
