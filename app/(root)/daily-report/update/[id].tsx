import { StatusBar } from "react-native";
import StackScreenHeader from "@/components/StackScreenHeader";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";
import UpdateDailyReportForm from "@/components/daily-report/UpdateDailyReportForm";

export default function UpdateDailyReport() {
  const { id } = useLocalSearchParams();

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar backgroundColor="#2d52d2" />

      <StackScreenHeader title="Your Daily Report" />
      <UpdateDailyReportForm id={id as string} />
    </SafeAreaView>
  );
}
