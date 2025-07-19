import LoadingScreen from "@/components/LoadingScreen";
import ProjectEmployees from "@/components/project/detail/ProjectEmployees";
import ProjectInfo from "@/components/project/detail/ProjectInfo";
import StackScreenHeader from "@/components/StackScreenHeader";
import TaskCard from "@/components/task/TaskCard";
import { useAccount } from "@/contexts/AccountContexts";
import { downloadFile } from "@/lib/file-save";
import {
  getProjectById,
  getProjectReportEvidences,
} from "@/lib/network/project";
import { useAuth } from "@clerk/clerk-expo";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import * as XLSX from "xlsx";
import { CreateTaskType } from "@/lib/types/task";
import { createTasks } from "@/lib/network/task";
import { useCustomToast } from "@/lib/useToast";

export default function ProjectDetail() {
  const [uploading, setUploading] = useState(false);

  const { id } = useLocalSearchParams();
  const { showToast } = useCustomToast();
  const queryClient = useQueryClient();
  const { getToken } = useAuth();
  const { account } = useAccount();

  const { data: project } = useQuery({
    queryFn: () => getProjectById(id as string, getToken),
    queryKey: ["project", id],
  });

  const isEmployee = project?.Employees.find(
    (emp) => emp.Account.id === account?.id
  );

  const { mutate: onCreateTasks } = useMutation({
    mutationFn: (values: CreateTaskType[]) => createTasks(values),
    onSuccess: () => {
      showToast("Success", "Project Tasks Added Successfully");
      queryClient.invalidateQueries({ queryKey: ["project", id] });
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
    onError: (err) => {
      console.log(err);
      showToast("Error", err?.message || "Failed To Create Task");
    },
  });

  const downloadTaskReport = async () => {
    if (!project) return;
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

  const handlePickExcel = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: [
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          "application/vnd.ms-excel",
        ],
        copyToCacheDirectory: true,
      });

      if (result.canceled) return;

      setUploading(true);

      const fileUri = result.assets[0].uri;

      // Read the file as base64
      const base64 = await FileSystem.readAsStringAsync(fileUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const binaryString = atob(base64); // Decode base64 to binary string
      const workbook = XLSX.read(binaryString, { type: "binary" });

      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet);

      // Ensure the format is correct: [{ type: "...", item: "...", quantity: ... }, ...]
      const formatted = jsonData.map((row: any) => ({
        type: row["type"]?.toString().trim() || "",
        item: row["item"]?.toString().trim() || "",
        quantity: Number(row["quantity"]) || 0,
        projectId: project?.id ?? "",
      }));

      // Send POST request
      onCreateTasks(formatted);
      Alert.alert("Success", "Data uploaded successfully");
    } catch (err: any) {
      console.error("Upload error:", err);
      Alert.alert("Error", "Failed to upload file");
    } finally {
      setUploading(false);
    }
  };

  if (!project) return <LoadingScreen />;

  return (
    <SafeAreaView className="flex-1 bg-primary-50 ">
      <FlatList
        data={project.Tasks}
        contentContainerStyle={{ paddingBottom: 24 }}
        ListHeaderComponent={() => (
          <>
            <StatusBar backgroundColor="#2d52d2" />
            <StackScreenHeader title="Project Detail" />
            <ProjectInfo project={project} />
            <ProjectEmployees
              employees={project?.Employees}
              isModifiable={false}
            />
            {isEmployee && (
              <View className="flex-row items-center justify-between gap-2 px-6 py-8 mt-3 bg-white">
                <Text className="text-xl font-cereal-bold">Project Task</Text>
                <View className="flex-row items-center gap-2 ">
                  <Pressable
                    onPress={() => downloadTaskReport()}
                    className="flex-row items-center gap-1 px-3 py-1 bg-primary-500 rounded-2xl"
                  >
                    <Download size={16} color="#fff" />
                  </Pressable>
                  <Pressable
                    onPress={() => handlePickExcel()}
                    className="flex-row items-center gap-1 px-3 py-1 bg-primary-500 rounded-2xl"
                  >
                    <View></View>
                    <Text className="text-sm text-white font-cereal-medium">
                      Import Excel
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

      <View className="absolute bottom-0 w-full px-6 py-4 bg-white border-t shadow-md border-slate-200">
        <Pressable
          onPress={() => {
            router.push({
              pathname: "/task/create/[projectId]",
              params: { projectId: project.id },
            });
          }}
        >
          <Text className="px-6 py-4 text-lg text-center text-white rounded-md shadow-lg font bg-primary-500 font-cereal-medium shadow-primary-500/50">
            Add New Task
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
