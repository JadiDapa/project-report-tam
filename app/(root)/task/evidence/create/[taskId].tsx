import { ScrollView, StatusBar } from "react-native";
import React from "react";
import CreateTaskForm from "@/components/task/CreateTaskForm";
import { useLocalSearchParams } from "expo-router";
import StackScreenHeader from "@/components/StackScreenHeader";
import CreateTaskEvidenceForm from "@/components/task/evidence/create/CreateTaskEvidenceForm";

export default function CreateTaskEvidence() {
  const { taskId } = useLocalSearchParams();

  return (
    <ScrollView className="flex-1 bg-white">
      <StatusBar backgroundColor="#2d52d2" />
      <StackScreenHeader title="Add Task Evidence" />
      <CreateTaskEvidenceForm taskId={taskId as string} />
    </ScrollView>
  );
}
