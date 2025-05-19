import {
  FlatList,
  SafeAreaView,
  StatusBar,
  View,
  Text,
  Pressable,
} from "react-native";
import { SetStateAction, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import SearchInput from "@/components/tabs/home/SearchInput";
import StackScreenHeader from "@/components/StackScreenHeader";
import { router } from "expo-router";
import { getAllDailyReports } from "@/lib/network/daily-report";
import DailyReportCard from "@/components/daily-report/DailyReportCard";
import SelectDailyReportDate from "@/components/daily-report/SelectDailyReportDate";
import { format } from "date-fns";

export default function DailyReports() {
  const [date, setDate] = useState(new Date());
  const [reportQuery, setProjectQuery] = useState("");

  const { data: dailyReports } = useQuery({
    queryFn: () => getAllDailyReports(),
    queryKey: ["daily-reports"],
  });

  const filteredDailtyReports = dailyReports?.filter((report) => {
    const reportDate = new Date(report.createdAt);
    const selectedDate = new Date(date);

    // Compare date by year, month, day only (ignore time)
    const isSameDate =
      reportDate.getDate() === selectedDate.getDate() &&
      reportDate.getMonth() === selectedDate.getMonth() &&
      reportDate.getFullYear() === selectedDate.getFullYear();

    return (
      report.title.toLowerCase().includes(reportQuery.toLowerCase()) &&
      isSameDate
    );
  });

  return (
    <SafeAreaView className="relative flex-1 bg-primary-50">
      <StatusBar backgroundColor="#2d52d2" />

      <StackScreenHeader title="All Daily Reports" />

      <SearchInput query={reportQuery} setQuery={setProjectQuery} />

      <SelectDailyReportDate
        date={date}
        setDate={(field: string, value: SetStateAction<Date>) => {
          if (field === "date") setDate(value);
        }}
      />

      <View className="flex-row items-center gap-2 px-6 mt-3">
        <Text className="text-2xl font-cereal-bold text-primary-500">
          {filteredDailtyReports?.length || 0}
        </Text>
        <Text className="font-cereal-medium">Reports Submitted at</Text>
        <Text className="font-cereal-medium text-primary-500">
          {format(date, "dd MMMM yyyy")}
        </Text>
      </View>

      <FlatList
        className="mt-2"
        data={filteredDailtyReports}
        keyExtractor={(report) => report.id.toString()}
        renderItem={({ item }) => <DailyReportCard report={item} />}
      />

      <View className="absolute bottom-0 w-full px-6 py-4 bg-white border-t shadow-md border-slate-200">
        <Pressable onPress={() => router.push("/daily-report/create")}>
          <Text className="px-6 py-4 text-lg text-center text-white rounded-md shadow-lg font bg-primary-500 font-cereal-medium shadow-primary-500/50">
            Export Daily Reports
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
