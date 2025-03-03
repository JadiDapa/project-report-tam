import ReportHeader from "@/components/report/detail/ReportHeader";
import ReportInfo from "@/components/report/detail/ReportInfo";
import UploadReportEvidences from "@/components/report/UploadReportEvidences";
import { getReportById } from "@/lib/network/report";
import { useAuth } from "@clerk/clerk-expo";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { SafeAreaView, ScrollView, StatusBar } from "react-native";
import LoadingScreen from "@/components/LoadingScreen";

export default function ReportDetail() {
  const [uploadedEvidences, setUploadedEvidences] = useState<any[]>([]);

  const { id } = useLocalSearchParams();

  const { getToken } = useAuth();

  const { data: report } = useQuery({
    queryFn: () => getReportById(id as string, getToken),
    queryKey: ["report", id],
  });

  useEffect(() => {
    if (report?.ReportEvidences) {
      setUploadedEvidences(report.ReportEvidences);
    }
  }, [report]);

  if (!report) return <LoadingScreen />;

  return (
    <SafeAreaView className="flex-1 bg-primary-50 ">
      <ScrollView className="py-6">
        <StatusBar backgroundColor="#eceffb" />
        <ReportHeader />

        <ReportInfo
          projectTitle={report.Project.title}
          reportTitle={report.title}
          date={report.createdAt}
          description={report.description}
        />
        <UploadReportEvidences
          uploadedEvidences={uploadedEvidences}
          setUploadedEvidences={setUploadedEvidences}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
