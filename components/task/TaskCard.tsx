import { View, Text, Pressable } from "react-native";
import React from "react";
import { TaskType } from "@/lib/types/task";
import { useRouter } from "expo-router";
import { format } from "date-fns";
import { Progress, ProgressFilledTrack } from "../ui/progress";

export default function TaskCard({ task }: { task: TaskType }) {
  const router = useRouter();

  const taskProgress =
    (task.TaskEvidences.filter(
      (evidence) => evidence.TaskEvidenceImages.length > 0
    ).length /
      (task.quantity ?? 1)) *
    100;

  return (
    <View className="flex-row px-6 pb-6 bg-white">
      <Pressable
        onPress={() =>
          router.push({
            pathname: `/task/[id]`,
            params: { id: task.id },
          })
        }
        className="flex-row items-center w-full overflow-hidden bg-white border shadow-lg border-primary-100 bg-primary rounded-xl"
      >
        <View className="w-6 h-full bg-primary-500" />

        <View className="justify-between flex-1 h-full p-4 ">
          <View className="gap-1">
            <Text className="capitalize text-primary-500 font-cereal-medium">{`${task.type} - ${task.item} `}</Text>

            <Text className="text-sm font-cereal-regular line-clamp-2">
              {task.description || "No Description Provided"}
            </Text>

            <Progress className="w-full mt-1" value={taskProgress} size={"sm"}>
              <ProgressFilledTrack />
            </Progress>

            <View className="flex-row items-center justify-between mt-1">
              <Text className="text-xs text-primary-500 font-cereal-medium">
                {task.quantity} Items
              </Text>
              <Text className="text-xs text-slate-500 font-cereal-regular">
                {format(task.createdAt, "MMM dd, yyyy")}
              </Text>
            </View>
          </View>
        </View>
      </Pressable>
    </View>
  );
}
