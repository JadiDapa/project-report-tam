import LoadingScreen from "@/components/LoadingScreen";
import StackScreenHeader from "@/components/StackScreenHeader";
import TaskInfo from "@/components/task/detail/TaskInfo";
import EvidenceCard from "@/components/task/evidence/EvidenceCard";
import { downloadFile } from "@/lib/file-save";
import { getTaskById, getTaskReportEvidences } from "@/lib/network/task";
import { useAuth } from "@clerk/clerk-expo";
import { useQuery } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import { Download, MessageCircleX, Plus } from "lucide-react-native";
import { useState } from "react";
import {
  Alert,
  FlatList,
  Pressable,
  SafeAreaView,
  StatusBar,
  Text,
  View,
  ActivityIndicator,
  Modal,
} from "react-native";

export default function TaskDetail() {
  const [downloading, setDownloading] = useState(false);

  const { id } = useLocalSearchParams();

  const { getToken } = useAuth();

  const { data: task } = useQuery({
    queryFn: () => getTaskById(id as string, getToken),
    queryKey: ["tasks", id],
  });

  const isEmployee = true;

  const downloadProjectReport = async () => {
    if (!task) return;

    try {
      setDownloading(true); // Start loading
      const url = await getTaskReportEvidences(task.id.toString(), getToken);
      if (!url) {
        Alert.alert("Error", "No file URL found.");
        return;
      }

      await downloadFile(
        url,
        "Project_Report.docx",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      );

      Alert.alert("Success", "File downloaded successfully.");
    } catch (error) {
      console.error("Download error", error);
      Alert.alert("Error", "Failed to download file.");
    } finally {
      setDownloading(false); // Stop loading
    }
  };

  if (!task) return <LoadingScreen />;

  return (
    <SafeAreaView className="flex-1 bg-primary-50 ">
      <FlatList
        data={task.TaskEvidences}
        contentContainerStyle={{ paddingBottom: 24 }}
        ListHeaderComponent={() => (
          <>
            <StatusBar backgroundColor="#2d52d2" />
            <StackScreenHeader title="Task Detail" />
            <TaskInfo task={task} />
            {isEmployee && (
              <View className="flex-row items-center justify-between gap-2 px-6 py-8 mt-3 bg-white">
                <Text className="text-xl font-cereal-bold">
                  Project Task Evidences
                </Text>
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
                        pathname: "/task/evidence/create/[taskId]",
                        params: { taskId: task.id },
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
        renderItem={({ item: evidence }) => (
          <EvidenceCard evidence={evidence} />
        )}
        ListFooterComponent={() => {
          return <View className="h-32 bg-white" />;
        }}
      />

      <View className="absolute bottom-0 w-full px-6 py-4 bg-white border-t shadow-md border-slate-200">
        <Pressable
          onPress={() => {
            router.push({
              pathname: "/task/evidence/create/[taskId]",
              params: { taskId: task.id },
            });
          }}
        >
          <Text className="px-6 py-4 text-lg text-center text-white rounded-md shadow-lg font bg-primary-500 font-cereal-medium shadow-primary-500/50">
            Add New Evidence
          </Text>
        </Pressable>
      </View>
      {downloading && (
        <Modal transparent animationType="fade">
          <View className="items-center justify-center flex-1 bg-black/40">
            <View className="p-6 bg-white rounded-lg">
              <ActivityIndicator size="large" color="#2d52d2" />
              <Text className="mt-4 font-cereal-medium text-md">
                Downloading...
              </Text>
            </View>
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
}
