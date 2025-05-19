import { ScrollView, StatusBar } from "react-native";
import StackScreenHeader from "@/components/StackScreenHeader";
import CreateDailyReportForm from "@/components/daily-report/CreateDailyReportForm";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CreateDailyReport() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar backgroundColor="#2d52d2" />

      <StackScreenHeader title="Your Daily Report" />
      <CreateDailyReportForm />
    </SafeAreaView>
  );
}
