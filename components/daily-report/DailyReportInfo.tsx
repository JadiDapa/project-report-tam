import { View, Text } from "react-native";
import { PanelLeftClose, PanelRightClose } from "lucide-react-native";
import { DailyReportType } from "@/lib/types/daily-report";
import { format } from "date-fns";

interface DailyReportInfoProps {
  dailyReport: DailyReportType;
}

export default function DailyReportInfo({ dailyReport }: DailyReportInfoProps) {
  return (
    <View className="relative flex-1">
      <View className="px-6 py-6 bg-white">
        <View className="flex flex-row items-center justify-center gap-2 ">
          <PanelRightClose color="#444" size={24} />
          <Text className="text-lg text-center font-cereal-medium text-slate-700">
            DAILY REPORT
          </Text>
          <PanelLeftClose color="#444" size={24} />
        </View>

        <Text className="text-xl text-center font-cereal-medium text-primary-500">
          By: {dailyReport.Account.fullname}
        </Text>

        <Text className="mt-4 text-lg leading-tight text-center font-cereal-medium">
          {dailyReport.title}
        </Text>
      </View>

      <View className="flex flex-row justify-between px-6 py-6 mt-4 bg-white">
        <View>
          <Text className="text-sm font-cereal-medium text-primary-500">
            Date/Time
          </Text>
          <Text className=" font-cereal-medium">
            {format(new Date(dailyReport.createdAt), "dd MMMM yyyy, HH:mm")}
          </Text>
        </View>
        <View className="flex flex-col items-end text-sm">
          <Text className=" font-cereal-medium text-end text-primary-500">
            Evidences
          </Text>
          <Text className=" font-cereal-medium text-end">
            {dailyReport.ReportEvidences.length || "No Evidence"}
          </Text>
        </View>
      </View>

      <View className="px-6 py-6 mt-4 bg-white">
        <Text className="text-lg font-cereal-medium">Report Detail</Text>
        <Text className={`font-cereal text-justify text-slate-600 mt-2`}>
          {dailyReport.description}
        </Text>
      </View>
    </View>
  );
}
