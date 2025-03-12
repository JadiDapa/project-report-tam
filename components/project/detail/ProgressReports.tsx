import { View, Text, Pressable, FlatList, Alert } from "react-native";
import React, { ReactElement } from "react";
import { Plus } from "lucide-react-native";
import { useRouter } from "expo-router";
import { ReportType } from "@/lib/types/report";
import { useUser } from "@clerk/clerk-expo";
import { useQuery } from "@tanstack/react-query";
import { getAccountByEmail } from "@/lib/network/account";
import { ProjectType } from "@/lib/types/project";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";

interface ProgressReportsProps {
  listHeader: ReactElement<any, any>;
  reports: ReportType[];
  project: ProjectType;
}

export default function ProgressReports({
  reports,
  listHeader,
  project,
}: ProgressReportsProps) {
  const router = useRouter();
  const { user } = useUser();

  const { data: account } = useQuery({
    queryFn: () =>
      getAccountByEmail(user?.primaryEmailAddress?.emailAddress || ""),
    queryKey: ["account"],
  });

  const isEmployee = project.Employees.find(
    (emp) => emp.Account.id === account?.id
  );

  const downloadAndShare = async () => {
    const fileUrl =
      "http://10.10.11.60:3000/uploads/evidences/project_report_First%20Project%20Test_1741764388408.docx";

    try {
      if (!fileUrl) {
        Alert.alert("Error", "Invalid file URL.");
        return;
      }

      // Extract file name safely
      const fileName = fileUrl.split("/").pop() || "downloaded_file.docx";

      // Ensure documentDirectory is available
      if (!FileSystem.documentDirectory) {
        Alert.alert("Error", "File system is not available.");
        return;
      }

      const fileUri = FileSystem.documentDirectory + fileName;

      // Download the file
      const { uri } = await FileSystem.downloadAsync(fileUrl, fileUri);

      // Ensure sharing is available
      if (!(await Sharing.isAvailableAsync())) {
        Alert.alert("Error", "Sharing is not available on this device.");
        return;
      }

      // Share the downloaded file
      await Sharing.shareAsync(uri);
    } catch (error) {
      console.error("Download error:", error);
      Alert.alert("Download failed", "Could not download the file.");
    }
  };

  return (
    <FlatList
      data={reports}
      contentContainerStyle={{ paddingBottom: 24 }}
      ListHeaderComponent={() => (
        <>
          {listHeader}
          {isEmployee && (
            <View className="flex-row items-center justify-between gap-2 px-6 mt-8">
              <Text className="text-xl font-cereal-bold">Progress Reports</Text>
              <Pressable
                onPress={() =>
                  router.push({
                    pathname: "/report/create/[projectId]",
                    params: { projectId: project.id },
                  })
                }
                className="flex-row items-center gap-1 px-3 py-1 bg-primary-500 rounded-2xl"
              >
                <Text className="text-sm text-white font-cereal-medium">
                  Report
                </Text>
                <Plus size={16} color="#fff" />
              </Pressable>
              <Pressable
                onPress={() =>
                  router.push({
                    pathname: "/report/create/[projectId]",
                    params: { projectId: project.id },
                  })
                }
                className="flex-row items-center gap-1 px-3 py-1 bg-primary-500 rounded-2xl"
              >
                <Text className="text-sm text-white font-cereal-medium">
                  Evidences
                </Text>
                <Plus size={16} color="#fff" />
              </Pressable>
            </View>
          )}
        </>
      )}
      renderItem={({ item: report }) => (
        <View className="px-6 mt-4">
          <Pressable
            onPress={() =>
              router.push({
                pathname: `/report/[id]`,
                params: { id: report.id },
              })
            }
            className="flex-row items-center w-full h-[96px] gap-3 p-4 bg-white shadow-md rounded-xl"
          >
            <View className="items-center justify-center border rounded-full border-slate-400 size-14 bg-primary-200">
              <Text className="text-xl text-white font-cereal-medium">DP</Text>
            </View>
            <View className="justify-between flex-1 h-full">
              <View className="">
                <Text className=" font-cereal-medium text-slate-700 line-clamp-2">
                  {report.serialNumber} - {report.location}
                </Text>
              </View>
              <View className="">
                <Text className="text-sm font-cereal text-slate-700 line-clamp-2">
                  {report.title}
                </Text>
              </View>

              <View className="flex-row items-center justify-between gap-1">
                <View className="flex-row items-center gap-1">
                  <Text className="text-sm text-primary-500 font-cereal-medium">
                    Daffa Althaf
                  </Text>
                </View>

                <Text className="text-xs text-slate-500 font-cereal">
                  {"3 Hours Ago"}
                </Text>
              </View>
            </View>
          </Pressable>
        </View>
      )}
      ListFooterComponent={() => {
        if (isEmployee)
          return (
            <View className="w-full px-6 mt-6">
              <Pressable
                onPress={() =>
                  router.push({
                    pathname: "/report/create/[projectId]",
                    params: { projectId: project.id },
                  })
                }
                className="items-center justify-center h-24 border-2 border-dashed rounded-xl"
              >
                <Plus size={24} color="#343539" />
                <Text className="text-lg font-cereal-medium">
                  Add New Report
                </Text>
              </Pressable>
            </View>
          );
      }}
    />
  );
}
