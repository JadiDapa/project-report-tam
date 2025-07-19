import { ScrollView, StatusBar } from "react-native";
import StackScreenHeader from "@/components/StackScreenHeader";
import { useLocalSearchParams } from "expo-router";
import UpdateTaskForm from "@/components/task/update/UpdateTaskForm";

export default function UpdateTask() {
  const { id } = useLocalSearchParams();

  return (
    <ScrollView className="flex-1 bg-white">
      <StatusBar backgroundColor="#2d52d2" />
      <StackScreenHeader title="Update Existing Task" />
      <UpdateTaskForm id={id as string} />
    </ScrollView>
  );
}
