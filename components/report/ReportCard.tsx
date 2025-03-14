import { View, Text, Pressable } from "react-native";
import React from "react";
import { ReportType } from "@/lib/types/report";
import { useRouter } from "expo-router";

export default function ReportCard({ report }: { report: ReportType }) {
  const router = useRouter();
  return (
    <View className="px-6 mt-4">
      <Pressable
        onPress={() =>
          router.push({
            pathname: `/report/[id]`,
            params: { id: report.id },
          })
        }
        className="flex-row items-center w-full h-[96px] gap-3 p-4 bg-white shadow-md rounded-xl"
      >
        <View className="items-center justify-center border rounded-full border-slate-400 size-14 bg-primary-200">
          <Text className="text-xl text-white font-cereal-medium">DP</Text>
        </View>
        <View className="justify-between flex-1 h-full">
          <View className="">
            <Text className=" font-cereal-medium text-slate-700 line-clamp-2">
              {report.serialNumber} - {report.location}
            </Text>
          </View>
          <View className="">
            <Text className="text-sm font-cereal text-slate-700 line-clamp-2">
              {report.title}
            </Text>
          </View>

          <View className="flex-row items-center justify-between gap-1">
            <View className="flex-row items-center gap-1">
              <Text className="text-sm text-primary-500 font-cereal-medium">
                Daffa Althaf
              </Text>
            </View>

            <Text className="text-xs text-slate-500 font-cereal">
              {"3 Hours Ago"}
            </Text>
          </View>
        </View>
      </Pressable>
    </View>
  );
}
