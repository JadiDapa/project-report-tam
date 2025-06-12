import {
  View,
  Text,
  Pressable,
  FlatList,
  Platform,
  Linking,
  Alert,
} from "react-native";
import React, { ReactElement } from "react";
import { Download, MessageCircleX, Plus } from "lucide-react-native";
import { useRouter } from "expo-router";
import { ReportType } from "@/lib/types/report";
import { useAuth } from "@clerk/clerk-expo";
import { ProjectType } from "@/lib/types/project";
import { getProjectReportEvidences } from "@/lib/network/project";
import * as FileSystem from "expo-file-system";
import { shareAsync } from "expo-sharing";
import * as IntentLauncher from "expo-intent-launcher";
import ReportCard from "@/components/report/ReportCard";
import { useAccount } from "@/contexts/AccountContexts";

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
  const { getToken } = useAuth();
  const { account, loading } = useAccount();

  if (loading || !account) return <Text>Loading account...</Text>;

  const isEmployee = true;

  const downloadFile = async () => {
    try {
      const evidence = await getProjectReportEvidences(
        project.id.toString(),
        getToken
      );

      if (!evidence) {
        throw new Error("File URL is missing.");
      }

      const filename = project.title + ".docx";
      const mimetype =
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

      const result = await FileSystem.downloadAsync(
        evidence,
        FileSystem.documentDirectory + filename
      );
      console.log("Downloaded file:", result);

      save(result.uri, filename, mimetype);
    } catch (error) {
      console.error("Download error:", error);
      Alert.alert(
        "Error",
        error instanceof Error ? error.message : "An unknown error occurred."
      );
    }
  };

  const save = async (uri: string, filename: string, mimetype: string) => {
    if (Platform.OS === "android") {
      const permissions =
        await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();

      if (!permissions.granted || !permissions.directoryUri) {
        Alert.alert("Permission Denied", "No directory selected.");
        shareAsync(uri);
        return;
      }

      try {
        console.log("Reading base64...");
        const base64 = await FileSystem.readAsStringAsync(uri, {
          encoding: FileSystem.EncodingType.Base64,
        });

        console.log("Creating file...");
        const fileUri = await FileSystem.StorageAccessFramework.createFileAsync(
          permissions.directoryUri,
          filename,
          mimetype
        );

        console.log("Writing file...");
        await FileSystem.writeAsStringAsync(fileUri, base64, {
          encoding: FileSystem.EncodingType.Base64,
        });

        console.log("Saved to:", fileUri);
        openFile(fileUri, mimetype);
      } catch (e) {
        console.error("Error saving file:", e);
        Alert.alert("Error", "Failed to save the file.");
      }
    } else {
      shareAsync(uri);
    }
  };

  const openFile = async (fileUri: string, mimetype: string) => {
    if (Platform.OS === "android") {
      try {
        await IntentLauncher.startActivityAsync("android.intent.action.VIEW", {
          data: fileUri,
          flags: 1,
          type: mimetype,
        });
      } catch (err) {
        console.error("Error opening file:", err);
        Alert.alert("Error", "No app found to open this file.");
      }
    } else {
      try {
        await Linking.openURL(fileUri);
      } catch (err) {
        console.error("Error opening file:", err);
        Alert.alert("Error", "Could not open file.");
      }
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
            <View className="flex-row items-center justify-between gap-2 px-6 py-8 mt-6 bg-white">
              <Text className="text-xl font-cereal-bold">Progress Reports</Text>
              <View className="flex-row items-center gap-2 ">
                <Pressable
                  onPress={() => downloadFile()}
                  className="flex-row items-center gap-1 px-3 py-1 bg-primary-500 rounded-2xl"
                >
                  <Download size={16} color="#fff" />
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
              No Report Available
            </Text>
          </View>
        </View>
      )}
      renderItem={({ item: report }) => <ReportCard report={report} />}
      ListFooterComponent={() => {
        return <View className="h-32 bg-white" />;
      }}
    />
  );
}
