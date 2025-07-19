import { View, Text, Pressable, FlatList, Alert } from "react-native";
import React, { ReactElement } from "react";
import { Download, MessageCircleX, Plus } from "lucide-react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";
import { ProjectType } from "@/lib/types/project";
import { useAccount } from "@/contexts/AccountContexts";
import { TaskType } from "@/lib/types/task";
import TaskCard from "@/components/task/TaskCard";
import { downloadFile } from "@/lib/file-save";
import { getProjectReportEvidences } from "@/lib/network/project";

interface ProjectTasksProps {
  listHeader: ReactElement<any, any>;
  tasks: TaskType[];
  project: ProjectType;
}

export default function ProjectTasks({
  tasks,
  listHeader,
  project,
}: ProjectTasksProps) {
  const router = useRouter();
  const { getToken } = useAuth();
  const { account, loading } = useAccount();

  if (loading || !account) return <Text>Loading account...</Text>;

  const isEmployee = true;

  const downloadProjectReport = async () => {
    const url = await getProjectReportEvidences(
      project.id.toString(),
      getToken
    );
    if (!url) {
      Alert.alert("Error", "No file URL found.");
      return;
    }

    await downloadFile(
      url,
      "Project_Report.docx",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    );
  };

  return (
    <FlatList
      data={tasks}
      contentContainerStyle={{ paddingBottom: 24 }}
      ListHeaderComponent={() => (
        <>
          {listHeader}
          {isEmployee && (
            <View className="flex-row items-center justify-between gap-2 px-6 py-8 mt-6 bg-white">
              <Text className="text-xl font-cereal-bold">Project Task</Text>
              <View className="flex-row items-center gap-2 ">
                <Pressable
                  onPress={() => downloadProjectReport()}
                  className="flex-row items-center gap-1 px-3 py-1 bg-primary-500 rounded-2xl"
                >
                  <Download size={16} color="#fff" />
                </Pressable>
                <Pressable
                  onPress={() =>
                    router.push({
                      pathname: "/task/create/[projectId]",
                      params: { projectId: project.id },
                    })
                  }
                  className="flex-row items-center gap-1 px-3 py-1 bg-primary-500 rounded-2xl"
                >
                  <View></View>
                  <Text className="text-sm text-white font-cereal-medium">
                    Report
                  </Text>
                  <Plus size={16} color="#fff" />
                </Pressable>
              </View>
            </View>
          )}
        </>
      )}
      ListEmptyComponent={() => (
        <View className="w-full px-6 bg-white">
          <View className="items-center justify-center h-24 border-2 border-dashed rounded-xl">
            <MessageCircleX size={24} color="#343539" />
            <Text className="text-lg font-cereal-medium">
              No Task Available
            </Text>
          </View>
        </View>
      )}
      renderItem={({ item: task }) => <TaskCard task={task} />}
      ListFooterComponent={() => {
        return <View className="h-32 bg-white" />;
      }}
    />
  );
}
