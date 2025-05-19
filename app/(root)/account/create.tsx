import { ScrollView, StatusBar } from "react-native";
import CreateAccountForm from "@/components/account/CreateAccountForm";
import StackScreenHeader from "@/components/StackScreenHeader";

export default function CreateProject() {
  return (
    <ScrollView className="bg-white ">
      <StatusBar backgroundColor="#2d52d2" />
      <StackScreenHeader title="Add New Account" />
      <CreateAccountForm />
    </ScrollView>
  );
}
