import { Pressable, Text, ScrollView, StatusBar, View } from "react-native";
import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import LoadingScreen from "@/components/LoadingScreen";
import StackScreenHeader from "@/components/StackScreenHeader";
import { getDailyReportById } from "@/lib/network/daily-report";
import DailyReportInfo from "@/components/daily-report/DailyReportInfo";
import UploadReportEvidences from "@/components/report/UploadReportEvidences";

export default function DailyReportDetail() {
  const { id } = useLocalSearchParams();
  const scrollRef = useRef<ScrollView>(null);

  const [uploadedEvidences, setUploadedEvidences] = useState<any[]>([]);

  const { data: dailyReport } = useQuery({
    queryFn: () => getDailyReportById(id as string),
    queryKey: ["daily-report", id],
  });

  useEffect(() => {
    if (dailyReport?.DailyReportEvidences) {
      setUploadedEvidences(dailyReport.DailyReportEvidences);
    }
  }, [dailyReport]);

  if (!dailyReport) return <LoadingScreen />;

  return (
    <View className="flex-1 bg-primary-50">
      <StatusBar backgroundColor="#2d52d2" />
      <StackScreenHeader title="Daily Report Detail" />

      <ScrollView
        ref={scrollRef}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <DailyReportInfo dailyReport={dailyReport} />
        <UploadReportEvidences
          uploadedEvidences={uploadedEvidences}
          setUploadedEvidences={setUploadedEvidences}
          isUpload={false}
        />
      </ScrollView>

      {/* <View className="absolute bottom-0 w-full px-6 py-4 bg-white border-t shadow-md border-slate-200">
        <Pressable onPress={() => {}}>
          <Text className="px-6 py-4 text-lg text-center text-white rounded-md shadow-lg font bg-primary-500 font-cereal-medium shadow-primary-500/50">
            Approve Report
          </Text>
        </Pressable>
      </View> */}
    </View>
  );
}
