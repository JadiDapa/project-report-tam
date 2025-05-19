import { ScrollView, StatusBar } from "react-native";
import React from "react";
import CreateReportForm from "@/components/report/CreateReportForm";
import { useLocalSearchParams } from "expo-router";
import StackScreenHeader from "@/components/StackScreenHeader";

export default function CreateProgressReport() {
  const { projectId } = useLocalSearchParams();

  return (
    <ScrollView className="flex-1 bg-white">
      <StatusBar backgroundColor="#2d52d2" />
      <StackScreenHeader title="Add Project Report" />
      <CreateReportForm projectId={projectId as string} />
    </ScrollView>
  );
}
