import { View, Text, Pressable } from "react-native";
import { PanelLeftClose, PanelRightClose, Pencil } from "lucide-react-native";
import { DailyReportType } from "@/lib/types/daily-report";
import { format } from "date-fns";
import { useAccount } from "@/contexts/AccountContexts";
import { router } from "expo-router";

interface DailyReportInfoProps {
  dailyReport: DailyReportType;
}

export default function DailyReportInfo({ dailyReport }: DailyReportInfoProps) {
  const { account } = useAccount();

  const isOwner = account?.id === dailyReport.Account.id;
  const isManager = account?.Role?.Features?.some((feature) => {
    return feature.name === "Manage Daily Report";
  });

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
        {isOwner && isManager && (
          <Pressable
            onPress={() =>
              router.push({
                pathname: "/daily-report/update/[id]",
                params: { id: dailyReport.id },
              })
            }
            className="flex flex-row items-center justify-center gap-2 mt-6"
          >
            <Text className="text-lg leading-tight text-center text-primary-500 font-cereal-medium">
              Modify
            </Text>

            <Pencil size={14} color={"#4459ff"} />
          </Pressable>
        )}
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
            {dailyReport.DailyReportEvidences.length || "No Evidence"}
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
