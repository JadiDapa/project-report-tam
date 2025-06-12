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
import StackScreenHeader from "@/components/StackScreenHeader";

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
      <StatusBar backgroundColor="#2d52d2" />
      <StackScreenHeader title="Report Detail" />
      <ScrollView>
        <ReportInfo
          projectTitle={report.Project.title}
          date={report.createdAt}
          reportTitle={report.title}
          description={report.description}
          serialNumber={report.serialNumber}
          location={report.location}
        />
        <UploadReportEvidences
          uploadedEvidences={uploadedEvidences}
          setUploadedEvidences={setUploadedEvidences}
        />
        {/* <ReportDiscussion
          reportId={report.id}
          accountId={report.accountId as number}
        /> */}
      </ScrollView>
    </SafeAreaView>
  );
}
