import { Progress, ProgressFilledTrack } from "@/components/ui/progress";
import { View, Text, Pressable } from "react-native";
import React, { useState } from "react";
import { Icon } from "@/components/ui/icon";
import {
  CalendarDaysIcon,
  ChevronDown,
  ChevronUp,
  Cog,
  Pencil,
} from "lucide-react-native";
import { router } from "expo-router";
import { useAccount } from "@/contexts/AccountContexts";
import { ProjectType } from "@/lib/types/project";
import { format } from "date-fns";

interface ProjectInfoProps {
  project: ProjectType;
}

export default function ProjectInfo({ project }: ProjectInfoProps) {
  const [moreDetail, setMoreDetail] = useState(false);
  const { account } = useAccount();

  const isAdmin = account?.Role?.Features?.some((feature) => {
    return feature.name === "Manage Project";
  });

  function globalPercentage() {
    if (!project?.Tasks || project.Tasks.length === 0) return 0;

    // Exclude tasks with item === "Documentation"
    const validTasks = project.Tasks.filter(
      (task) => task.item !== "Documentation"
    );
    if (validTasks.length === 0) return 0;

    const totalPercentage = validTasks.reduce((sum, task) => {
      const filledEvidences = task.TaskEvidences.filter(
        (e) => e.TaskEvidenceImages.length > 0
      ).length;
      const taskCompletion = Math.min(
        filledEvidences / (task.quantity ?? 1),
        1
      ); // Cap at 100%
      return sum + taskCompletion;
    }, 0);

    const averagePercentage = (totalPercentage / validTasks.length) * 100;
    return Number(averagePercentage.toFixed(1));
  }

  return (
    <View className="">
      <View className="px-6 py-6 bg-white">
        <View className="flex flex-row items-center justify-center gap-2 ">
          <Cog color="#444" size={24} />
          <Text className="text-lg text-center font-cereal-medium text-slate-700">
            PROJECT
          </Text>
          <Cog color="#444" size={24} />
        </View>

        <Text className="text-xl text-center font-cereal-medium text-primary-500">
          #PR-060525-0001
        </Text>

        <View className="flex flex-row items-center justify-center gap-2 mt-3">
          <Text className="text-lg leading-tight text-center font-cereal-medium">
            {project.title}
          </Text>
          {isAdmin && (
            <Pressable
              onPress={() =>
                router.push({
                  pathname: "/project/update/[id]",
                  params: { id: project.id },
                })
              }
            >
              <Pencil size={14} color={"#4459ff"} />
            </Pressable>
          )}
        </View>
      </View>

      <View className="px-6 py-6 mt-3 bg-white ">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-lg font-cereal-medium">Start</Text>
            <View className="flex-row items-center gap-2">
              <Icon as={CalendarDaysIcon} size="sm" color="#4459ff" />
              <Text className="font-cereal">
                {format(project.startDate, "dd MMMM yyyy")}
              </Text>
            </View>
          </View>
          <View>
            <Text className="text-lg font-cereal-medium text-end">
              Deadline
            </Text>
            <View className="flex-row items-center gap-2">
              <Icon as={CalendarDaysIcon} size="sm" color="#4459ff" />
              <Text className="font-cereal">
                {format(project.endDate, "dd MMMM yyyy")}
              </Text>
            </View>
          </View>
        </View>
        <View className="gap-1 mt-9">
          <View className="flex-row items-center justify-between ">
            <Text className="text-lg font-cereal-medium">In Progress</Text>
            <Text className="text-lg font-cereal-medium">
              {globalPercentage()} %
            </Text>
          </View>
          <Progress
            className="w-full bg-primary-100"
            value={globalPercentage()}
            size={"sm"}
          >
            <ProgressFilledTrack />
          </Progress>
        </View>
      </View>

      <View className="px-6 py-6 mt-3 bg-white ">
        <Text className="text-xl font-cereal-bold">Overview</Text>
        <Text
          className={`font-cereal text-justify text-slate-600 ${
            moreDetail ? "" : "line-clamp-5"
          }`}
        >
          {project.description && project.description}
        </Text>
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
      </View>
    </View>
  );
}
