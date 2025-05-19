import { ScrollView, StatusBar } from "react-native";
import StackScreenHeader from "@/components/StackScreenHeader";
import CreateFeatureForm from "@/components/feature/CreateFeatureForm";

export default function CreateFeature() {
  return (
    <ScrollView className="bg-white ">
      <StatusBar backgroundColor="#2d52d2" />
      <StackScreenHeader title="Add New Feature" />
      <CreateFeatureForm />
    </ScrollView>
  );
}
