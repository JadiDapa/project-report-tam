import { ScrollView } from "react-native";
import React from "react";
import CreateProjectHeader from "@/components/project/create/CreateProjectHeader";
import CreateProjectForm from "@/components/project/create/CreateProjectForm";

export default function CreateProject() {
  return (
    <ScrollView className="py-8 bg-primary-50">
      <CreateProjectHeader />
      <CreateProjectForm />
    </ScrollView>
  );
}
