import { Pressable, Text, ScrollView, StatusBar, View } from "react-native";
import { useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import LoadingScreen from "@/components/LoadingScreen";
import StackScreenHeader from "@/components/StackScreenHeader";
import { getDailyReportById } from "@/lib/network/daily-report";
import DailyReportInfo from "@/components/daily-report/DailyReportInfo";

export default function DailyReportDetail() {
  const { id } = useLocalSearchParams();
  const scrollRef = useRef<ScrollView>(null);

  const { data: dailyReport } = useQuery({
    queryFn: () => getDailyReportById(id as string),
    queryKey: ["daily-report", id],
  });

  if (!dailyReport) return <LoadingScreen />;

  console.log(dailyReport);

  return (
    <View className="flex-1 bg-primary-50">
      <StatusBar backgroundColor="#2d52d2" />
      <StackScreenHeader title="Daily Report Detail" />

      <ScrollView
        ref={scrollRef}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <DailyReportInfo dailyReport={dailyReport} />
      </ScrollView>

      <View className="absolute bottom-0 w-full px-6 py-4 bg-white border-t shadow-md border-slate-200">
        <Pressable onPress={() => {}}>
          <Text className="px-6 py-4 text-lg text-center text-white rounded-md shadow-lg font bg-primary-500 font-cereal-medium shadow-primary-500/50">
            Approve Report
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
