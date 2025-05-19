import { ScrollView, StatusBar } from "react-native";
import StackScreenHeader from "@/components/StackScreenHeader";
import CreateRoleForm from "@/components/role/CreateRoleForm";

export default function CreateRole() {
  return (
    <ScrollView className="bg-white ">
      <StatusBar backgroundColor="#2d52d2" />
      <StackScreenHeader title="Add New Role" />
      <CreateRoleForm />
    </ScrollView>
  );
}
