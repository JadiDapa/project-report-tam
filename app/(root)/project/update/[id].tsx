import { ScrollView, StatusBar } from "react-native";
import StackScreenHeader from "@/components/StackScreenHeader";
import { useLocalSearchParams } from "expo-router";
import UpdateProjectForm from "@/components/project/update/UpdateProjectForm";

export default function UpdateProject() {
  const { id } = useLocalSearchParams();

  return (
    <ScrollView className="flex-1 bg-white">
      <StatusBar backgroundColor="#2d52d2" />
      <StackScreenHeader title="Update Existing Project" />
      <UpdateProjectForm id={id as string} />
    </ScrollView>
  );
}
