import { ScrollView, StatusBar } from "react-native";
import CreateProjectForm from "@/components/project/create/CreateProjectForm";
import StackScreenHeader from "@/components/StackScreenHeader";

export default function CreateProject() {
  return (
    <ScrollView className="flex-1 bg-white">
      <StatusBar backgroundColor="#2d52d2" />
      <StackScreenHeader title="Add New Project" />
      <CreateProjectForm />
    </ScrollView>
  );
}
