import { Progress, ProgressFilledTrack } from "@/components/ui/progress";
import { View, Text, Pressable } from "react-native";
import React, { useState } from "react";
import { Icon } from "@/components/ui/icon";
import {
  CalendarDaysIcon,
  Cctv,
  ChevronDown,
  ChevronUp,
  Cog,
  Pencil,
} from "lucide-react-native";
import { router } from "expo-router";
import { useAccount } from "@/contexts/AccountContexts";
import { TaskType } from "@/lib/types/task";
import { format } from "date-fns";

interface TaskInfoProps {
  task: TaskType;
}

export default function TaskInfo({ task }: TaskInfoProps) {
  const [moreDetail, setMoreDetail] = useState(false);
  const { account } = useAccount();

  const isAdmin = account?.Role?.Features?.some((feature) => {
    return feature.name === "Manage Project";
  });

  const taskProgress =
    (task.TaskEvidences.filter(
      (evidence) => evidence.TaskEvidenceImages.length > 0
    ).length /
      (task.quantity ?? 1)) *
    100;

  return (
    <View className="">
      <View className="px-6 py-6 bg-white">
        <View className="flex flex-row items-center justify-center gap-2 ">
          <Cog color="#444" size={24} />
          <Text className="text-lg text-center font-cereal-medium text-slate-700">
            TASK
          </Text>
          <Cog color="#444" size={24} />
        </View>

        <View className="flex flex-row items-center justify-center gap-2 mt-2">
          <Text className="text-xl text-center capitalize font-cereal-medium text-primary-500">
            {`${task.type} - ${task.item}`}
          </Text>
          {isAdmin && (
            <Pressable
              onPress={() =>
                router.push({
                  pathname: "/task/update/[id]",
                  params: { id: task.id },
                })
              }
            >
              <Pencil size={14} color={"#4459ff"} />
            </Pressable>
          )}
        </View>

        <Text className="text-sm leading-tight text-center font-cereal-regular">
          Project : {task.Project.title}
        </Text>
      </View>

      <View className="px-6 py-6 mt-3 bg-white ">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-lg font-cereal-medium">Items</Text>
            <View className="flex-row items-center gap-2">
              <Cctv size={16} color="#4459ff" />
              <Text className="font-cereal">{task.quantity} Items</Text>
            </View>
          </View>
          <View className="flex-col items-end">
            <Text className="text-lg font-cereal-medium text-end">Created</Text>
            <View className="flex-row items-center gap-2">
              <Icon as={CalendarDaysIcon} size="sm" color="#4459ff" />
              <Text className="font-cereal">
                {format(task.createdAt, "dd MMMM yyyy")}
              </Text>
            </View>
          </View>
        </View>
        <View className="gap-1 mt-9">
          <View className="flex-row items-center justify-between ">
            <Text className="text-lg font-cereal-medium">In Progress</Text>
            <Text className="text-lg font-cereal-medium">
              {Number(taskProgress.toFixed(1))}% (
              {
                task.TaskEvidences.filter(
                  (evidence) => evidence.TaskEvidenceImages.length > 0
                ).length
              }{" "}
              / {task.quantity})
            </Text>
          </View>
          <Progress
            className="w-full bg-primary-100"
            value={taskProgress}
            size={"sm"}
          >
            <ProgressFilledTrack />
          </Progress>
        </View>
      </View>

      <View className="px-6 py-6 mt-3 bg-white ">
        <Text className="text-xl font-cereal-bold">Task Detail</Text>
        <Text
          className={`font-cereal text-justify text-slate-600 ${
            moreDetail ? "" : "line-clamp-5"
          }`}
        >
          {task.description || "No Description Provided"}
        </Text>
        {task.description && (
          <Pressable
            className="flex-row items-center self-end gap-2"
            onPress={() => setMoreDetail(!moreDetail)}
          >
            <Icon
              as={moreDetail ? ChevronUp : ChevronDown}
              size="lg"
              color="#4459ff"
            />
            <Text className="eading-tight font-cereal text-primary-500">
              {moreDetail ? "Show Less" : "Show More"}
            </Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}
