import { ScrollView } from "react-native";
import React from "react";
import CreateReportHeader from "@/components/report/CreateReportHeader";
import CreateReportForm from "@/components/report/CreateReportForm";
import { useLocalSearchParams } from "expo-router";

export default function CreateProgressReport() {
  const { projectId } = useLocalSearchParams();

  return (
    <ScrollView className="flex-1 py-8 bg-primary-50">
      <CreateReportHeader />
      <CreateReportForm projectId={projectId as string} />
    </ScrollView>
  );
}
