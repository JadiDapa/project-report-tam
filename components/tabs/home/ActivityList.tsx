import { useRouter } from "expo-router";
import { View, Text, FlatList, Pressable } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { getAllDailyReports } from "@/lib/network/daily-report";
import { format } from "date-fns";

export default function ReportList() {
  const router = useRouter();

  const { data: reports } = useQuery({
    queryFn: () => getAllDailyReports(),
    queryKey: ["reports"],
  });

  return (
    <View className="py-6 mt-4 bg-white">
      {/* Header placed separately */}
      <View className="flex-row items-center justify-between px-6">
        <Text className="text-lg font-cereal-medium">Latest Daily Reports</Text>
        <View className="border rounded-full px-3 py-0.5">
          <Text className="text-sm font-cereal-medium">View All</Text>
        </View>
      </View>

      <FlatList
        data={reports}
        horizontal
        className="mt-4 ps-6"
        showsHorizontalScrollIndicator={false}
        keyExtractor={(project) => project.id.toString()}
        renderItem={({ item: report }) => (
          <Pressable
            onPress={() =>
              router.push({
                pathname: `/daily-report/[id]`,
                params: { id: report.id },
              })
            }
            className="flex-row items-center w-[88vw] me-4 h-40 gap-3 p-4 py-5 bg-primary-50 rounded-xl  border-2 border-primary-100"
          >
            <View className="justify-between flex-1 h-full">
              <Text className=" line-clamp-2 font-cereal-bold">
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
                  {report.DailyReportEvidences.length} Evidences
                </Text>
              </View>
            </View>
          </Pressable>
        )}
      />

      {/* <FlatList
        data={reports}
        horizontal
        className="mt-2 ps-6"
        showsHorizontalScrollIndicator={false}
        keyExtractor={(project) => project.id.toString()}
        renderItem={({ item: report }) => (
          <Pressable
            onPress={() => router.push(`/`)}
            className="flex-row items-center w-64 h-32 gap-2 p-4 mr-3 bg-white shadow-md rounded-xl"
          >
            <View className="justify-between flex-1 h-full">
              <View className="">
                <Text className=" mt-0.5 text-sm font-cereal text-slate-700 line-clamp-2">
                  {report.description}
                </Text>
              </View>
              <View className="flex-row items-center justify-between gap-1">
                <View className="flex-row items-center gap-1">
                  <View className="items-center justify-center border rounded-full border-slate-400 size-5">
                    <Text className="text-[10px] text-slate-500 font-cereal-medium">
                      DP
                    </Text>
                  </View>
                  <Text className="text-sm text-primary-500 font-cereal-medium">
                    {report.Account.fullname}
                  </Text>
                </View>

                <Text className="text-xs text-slate-500 font-cereal">
                  {format(report.createdAt, "MMM, dd yyyy")}
                </Text>
              </View>
            </View>
          </Pressable>
        )}
      /> */}
    </View>
  );
}
