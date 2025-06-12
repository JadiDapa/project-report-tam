import {
  FlatList,
  SafeAreaView,
  StatusBar,
  View,
  Text,
  Pressable,
  Alert,
  Platform,
  Linking,
} from "react-native";
import { SetStateAction, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import SearchInput from "@/components/tabs/home/SearchInput";
import StackScreenHeader from "@/components/StackScreenHeader";
import * as FileSystem from "expo-file-system";
import { shareAsync } from "expo-sharing";
import * as IntentLauncher from "expo-intent-launcher";
import {
  getAllDailyReports,
  getDailyReportEvidences,
} from "@/lib/network/daily-report";
import DailyReportCard from "@/components/daily-report/DailyReportCard";
import SelectDailyReportDate from "@/components/daily-report/SelectDailyReportDate";
import { format } from "date-fns";
import { useAuth } from "@clerk/clerk-expo";

export default function DailyReports() {
  const [date, setDate] = useState(new Date());
  const [reportQuery, setProjectQuery] = useState("");

  const { getToken } = useAuth();

  const { data: dailyReports } = useQuery({
    queryFn: () => getAllDailyReports(),
    queryKey: ["daily-reports"],
  });

  console.log(dailyReports);

  const downloadFile = async () => {
    try {
      const evidence = await getDailyReportEvidences(
        date.toISOString(),
        getToken
      );

      if (!evidence) {
        throw new Error("File URL is missing.");
      }

      const filename = "Daily Report" + format(date, "yyyy-MM-dd") + ".docx";
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

  const filteredDailtyReports = dailyReports?.filter((report) => {
    const reportDate = new Date(report.createdAt);
    const selectedDate = new Date(date);

    // Compare date by year, month, day only (ignore time)
    const isSameDate =
      reportDate.getDate() === selectedDate.getDate() &&
      reportDate.getMonth() === selectedDate.getMonth() &&
      reportDate.getFullYear() === selectedDate.getFullYear();

    return (
      report.title.toLowerCase().includes(reportQuery.toLowerCase()) &&
      isSameDate
    );
  });

  return (
    <SafeAreaView className="relative flex-1 bg-primary-50">
      <StatusBar backgroundColor="#2d52d2" />

      <StackScreenHeader title="All Daily Reports" />

      <SearchInput query={reportQuery} setQuery={setProjectQuery} />

      <SelectDailyReportDate
        date={date}
        setDate={(field: string, value: SetStateAction<Date>) => {
          if (field === "date") setDate(value);
        }}
      />

      <View className="flex-row items-center gap-2 px-6 mt-3">
        <Text className="text-2xl font-cereal-bold text-primary-500">
          {filteredDailtyReports?.length || 0}
        </Text>
        <Text className="font-cereal-medium">Reports Submitted at</Text>
        <Text className="font-cereal-medium text-primary-500">
          {format(date, "dd MMMM yyyy")}
        </Text>
      </View>

      <FlatList
        className="mt-2"
        data={filteredDailtyReports}
        keyExtractor={(report) => report.id.toString()}
        renderItem={({ item }) => <DailyReportCard report={item} />}
      />

      <View className="absolute bottom-0 w-full px-6 py-4 bg-white border-t shadow-md border-slate-200">
        <Pressable onPress={() => downloadFile()}>
          <Text className="px-6 py-4 text-lg text-center text-white rounded-md shadow-lg font bg-primary-500 font-cereal-medium shadow-primary-500/50">
            Export Daily Reports
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
