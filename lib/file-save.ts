import { getProjectReportEvidences } from "./network/project";
import * as FileSystem from "expo-file-system";
import { shareAsync } from "expo-sharing";
import * as IntentLauncher from "expo-intent-launcher";
import { Platform, Linking, Alert } from "react-native";

export const downloadFile = async (
  fileUrl: string,
  filename: string,
  mimetype: string
) => {
  try {
    if (!fileUrl) {
      throw new Error("File URL is missing.");
    }

    const result = await FileSystem.downloadAsync(
      fileUrl,
      FileSystem.documentDirectory + filename
    );

    console.log("Downloaded file:", result);
    await save(result.uri, filename, mimetype);
  } catch (error) {
    console.error("Download error:", error);
    Alert.alert(
      "Error",
      error instanceof Error ? error.message : "An unknown error occurred."
    );
  }
};

export const save = async (uri: string, filename: string, mimetype: string) => {
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

export const openFile = async (fileUri: string, mimetype: string) => {
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
