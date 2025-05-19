import { View, Text, Pressable } from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import { DailyReportType } from "@/lib/types/daily-report";
import { format } from "date-fns";

export default function DailyReportCard({
  report,
}: {
  report: DailyReportType;
}) {
  const router = useRouter();
  return (
    <View className="flex-1 px-6 mb-4 ">
      <Pressable
        onPress={() =>
          router.push({
            pathname: `/daily-report/[id]`,
            params: { id: report.id },
          })
        }
        className="flex-row items-center w-full gap-3 p-4 py-5 bg-white shadow-md rounded-xl"
      >
        <View className="justify-between flex-1 h-full">
          <Text className="font-cereal-bold text-slate-700 line-clamp-2">
            {report.title}
          </Text>
          <Text className="mt-2 text-sm font-cereal-regular text-slate-500 line-clamp-2">
            {report.description}
          </Text>

          <View className="flex-row items-center justify-between gap-1 mt-3">
            <Text className="text-xs text-slate-500 font-cereal">
              {format(report.createdAt.toString(), "dd MMMM yyyy")}
            </Text>

            <Text className="text-sm text-primary-500 font-cereal-medium">
              {report.ReportEvidences.length} Evidences
            </Text>
          </View>
        </View>
      </Pressable>
    </View>
  );
}
