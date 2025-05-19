import {
  FlatList,
  SafeAreaView,
  StatusBar,
  View,
  Text,
  ScrollView,
  Pressable,
} from "react-native";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import SearchInput from "@/components/tabs/home/SearchInput";
import StackScreenHeader from "@/components/StackScreenHeader";
import { getDailyReportsByAccountId } from "@/lib/network/daily-report";
import DailyReportCard from "@/components/daily-report/DailyReportCard";
import { isThisWeek, isToday, parseISO } from "date-fns";
import { router, useLocalSearchParams } from "expo-router";

export default function DailyDailyReports() {
  const { accountId } = useLocalSearchParams();

  const [reportQuery, setProjectQuery] = useState("");

  const { data: dailyReports } = useQuery({
    queryFn: () => getDailyReportsByAccountId(accountId.toString()),
    queryKey: ["daily-reports", accountId],
  });

  if (!dailyReports) return null;

  const filteredReports = dailyReports.filter((report) =>
    report.title.toLowerCase().includes(reportQuery.toLowerCase())
  );

  const todayReports = filteredReports.filter((r) =>
    isToday(parseISO(r.createdAt.toString()))
  );

  const thisWeekReports = filteredReports.filter(
    (r) =>
      !isToday(parseISO(r.createdAt.toString())) &&
      isThisWeek(parseISO(r.createdAt.toString()), { weekStartsOn: 1 })
  );

  const earlierReports = filteredReports.filter(
    (r) => !isThisWeek(parseISO(r.createdAt.toString()), { weekStartsOn: 1 })
  );

  const filteredProjects = dailyReports.filter((report) => {
    const matchesSearch = report.title
      .toLowerCase()
      .includes(reportQuery.toLowerCase());

    return matchesSearch;
  });

  return (
    <SafeAreaView className="relative flex-1 bg-primary-50">
      <StatusBar backgroundColor="#2d52d2" />

      <StackScreenHeader title="Your Daily Reports" />

      <SearchInput query={reportQuery} setQuery={setProjectQuery} />

      <ScrollView className="mt-6">
        {todayReports.length > 0 && (
          <View className="mb-2 ">
            <Text className="px-6 py-2 text-lg text-gray-700 font-cereal-medium">
              Today
            </Text>
            <FlatList
              data={todayReports}
              keyExtractor={(report) => report.id.toString()}
              renderItem={({ item }) => <DailyReportCard report={item} />}
              scrollEnabled={false}
            />
          </View>
        )}

        {thisWeekReports.length > 0 && (
          <View className="mb-2">
            <Text className="px-6 py-2 text-gray-700 px-6text-lg font-cereal-medium">
              This Week
            </Text>
            <FlatList
              data={thisWeekReports}
              keyExtractor={(report) => report.id.toString()}
              renderItem={({ item }) => <DailyReportCard report={item} />}
              scrollEnabled={false}
            />
          </View>
        )}

        {earlierReports.length > 0 && (
          <View className="mb-2">
            <Text className="px-6 py-2 text-lg text-gray-700 font-cereal-medium">
              Earlier
            </Text>
            <FlatList
              data={earlierReports}
              keyExtractor={(report) => report.id.toString()}
              renderItem={({ item }) => <DailyReportCard report={item} />}
              scrollEnabled={false}
            />
          </View>
        )}
      </ScrollView>

      <View className="absolute bottom-0 w-full px-6 py-4 bg-white border-t shadow-md border-slate-200">
        <Pressable onPress={() => router.push("/daily-report/create")}>
          <Text className="px-6 py-4 text-lg text-center text-white rounded-md shadow-lg font bg-primary-500 font-cereal-medium shadow-primary-500/50">
            Create Daily Report
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
