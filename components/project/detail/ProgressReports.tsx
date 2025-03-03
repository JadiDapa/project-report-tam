import { View, Text, Pressable, FlatList } from "react-native";
import React, { ReactElement } from "react";
import { Plus } from "lucide-react-native";
import { useRouter } from "expo-router";
import { ReportType } from "@/lib/types/report";

interface ProgressReportsProps {
  listHeader: ReactElement<any, any>;
  reports: ReportType[];
  projectId: string;
}

export default function ProgressReports({
  reports,
  listHeader,
  projectId,
}: ProgressReportsProps) {
  const router = useRouter();
  return (
    <FlatList
      data={reports}
      contentContainerStyle={{ paddingBottom: 24 }}
      ListHeaderComponent={() => (
        <>
          {listHeader}
          <View className="flex-row items-center justify-between gap-2 px-6 mt-8">
            <Text className="text-xl font-cereal-bold">Progress Reports</Text>
            <Pressable
              onPress={() =>
                router.push({
                  pathname: "/report/create/[projectId]",
                  params: { projectId: projectId },
                })
              }
              className="flex-row items-center gap-1 px-3 py-1 bg-primary-500 rounded-2xl"
            >
              <Text className="text-sm text-white font-cereal-medium">
                Report
              </Text>
              <Plus size={16} color="#fff" />
            </Pressable>
          </View>
        </>
      )}
      renderItem={({ item: report }) => (
        <View className="px-6 mt-4">
          <Pressable
            onPress={() =>
              router.push({
                pathname: `/report/[id]`,
                params: { id: report.id },
              })
            }
            className="flex-row items-center w-full h-24 gap-3 p-4 bg-white shadow-md rounded-xl"
          >
            <View className="items-center justify-center border rounded-full border-slate-400 size-14 bg-primary-200">
              <Text className="text-xl text-white font-cereal-medium">DP</Text>
            </View>
            <View className="justify-between flex-1 h-full">
              <View className="">
                <Text className="mt-0.5  font-cereal-medium text-slate-700 line-clamp-2">
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
      )}
      ListFooterComponent={() => (
        <View className="w-full px-6 mt-6">
          <Pressable
            onPress={() =>
              router.push({
                pathname: "/report/create/[projectId]",
                params: { projectId: projectId },
              })
            }
            className="items-center justify-center h-24 border-2 border-dashed rounded-xl"
          >
            <Plus size={24} color="#343539" />
            <Text className="text-lg font-cereal-medium">Add New Report</Text>
          </Pressable>
        </View>
      )}
    />
  );
}
