import { View, Text, Pressable } from "react-native";
import React from "react";
import { ProjectType } from "@/lib/types/project";
import { router } from "expo-router";
import { Progress, ProgressFilledTrack } from "@/components/ui/progress";
import Feather from "@expo/vector-icons/Feather";
import { format } from "date-fns";
import { statuses } from "@/components/project/create/CreateProjectForm";

export default function ProjectCard({ project }: { project: ProjectType }) {
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

  const status = statuses.find((s) => s.value === project.status);

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
          <View
            className={`items-center justify-center w-20 h-6 rounded-full ${
              status?.bg ?? "bg-gray-200"
            }`}
          >
            <Text className="text-sm text-white capitalize font-cereal-medium">
              {project.status}
            </Text>
          </View>
        </View>
        <Text className="mt-1 text-sm font-cereal line-clamp-2">
          {project.description}
        </Text>

        <Progress
          className="w-full mt-3"
          value={globalPercentage()}
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
            {project.Employees && (
              <Text className="text-primary-800 font-cereal">
                {project.Employees.length} Employees
              </Text>
            )}
          </View>
        </View>
      </Pressable>
    </View>
  );
}
