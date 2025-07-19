import { ScrollView, StatusBar } from "react-native";
import React from "react";
import CreateTaskForm from "@/components/task/CreateTaskForm";
import { useLocalSearchParams } from "expo-router";
import StackScreenHeader from "@/components/StackScreenHeader";

export default function CreateProjectTask() {
  const { projectId } = useLocalSearchParams();

  return (
    <ScrollView className="flex-1 bg-white">
      <StatusBar backgroundColor="#2d52d2" />
      <StackScreenHeader title="Add Project Task" />
      <CreateTaskForm projectId={projectId as string} />
    </ScrollView>
  );
}
