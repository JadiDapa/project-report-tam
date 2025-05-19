import DailyReportCard from "@/components/daily-report/DailyReportCard";
import EmployeeMenuSelect from "@/components/employee/EmployeeMenuSelect";
import LoadingScreen from "@/components/LoadingScreen";
import ReportCard from "@/components/report/ReportCard";
import StackScreenHeader from "@/components/StackScreenHeader";
import ProfileInfo from "@/components/tabs/profile/ProfileInfo";
import ProjectCard from "@/components/tabs/projects/ProjectCard";
import { getAccountById } from "@/lib/network/account";
import { DailyReportType } from "@/lib/types/daily-report";
import { ReportType } from "@/lib/types/report";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import { useCallback, useState } from "react";
import {
  FlatList,
  RefreshControl,
  SafeAreaView,
  StatusBar,
  View,
} from "react-native";

export default function EmployeeDetail() {
  const [selectedMenu, setSelectedMenu] = useState("projects");
  const { id } = useLocalSearchParams();

  const {
    data: account,
    refetch,
    isFetching,
  } = useQuery({
    queryFn: () => getAccountById(id as string),
    queryKey: ["account", id],
  });

  const onRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  if (!account) return <LoadingScreen />;

  const headerContent = (
    <SafeAreaView className="relative flex-1 bg-primary-50">
      <StackScreenHeader title="Account Detail" />
      <ProfileInfo account={account} />
      <EmployeeMenuSelect
        selectedMenu={selectedMenu}
        setSelectedMenu={setSelectedMenu}
      />
    </SafeAreaView>
  );

  return (
    <View className="flex-1 bg-primary-50">
      <StatusBar backgroundColor="#2d52d2" />

      {selectedMenu === "projects" ? (
        <ProjectList
          projects={account.Projects ?? []}
          header={headerContent}
          isFetching={isFetching}
          onRefresh={onRefresh}
        />
      ) : (
        <ReportList
          reports={account.DailyReports ?? []}
          header={headerContent}
          isFetching={isFetching}
          onRefresh={onRefresh}
        />
      )}
    </View>
  );
}

function ProjectList({
  projects,
  header,
  isFetching,
  onRefresh,
}: {
  projects: any[];
  header: JSX.Element;
  isFetching: boolean;
  onRefresh: () => void;
}) {
  return (
    <FlatList
      data={projects}
      keyExtractor={(project) => project.id.toString()}
      ListHeaderComponent={header}
      refreshControl={
        <RefreshControl refreshing={isFetching} onRefresh={onRefresh} />
      }
      renderItem={({ item }) => (
        <ProjectCard
          project={{
            ...item,
            title: item?.Project?.title,
            description: item?.Project?.description,
            status: item?.Project?.status,
          }}
        />
      )}
    />
  );
}

function ReportList({
  reports,
  header,
  isFetching,
  onRefresh,
}: {
  reports: DailyReportType[];
  header: JSX.Element;
  isFetching: boolean;
  onRefresh: () => void;
}) {
  return (
    <FlatList
      data={reports}
      keyExtractor={(report) => report.id.toString()}
      ListHeaderComponent={header}
      refreshControl={
        <RefreshControl refreshing={isFetching} onRefresh={onRefresh} />
      }
      renderItem={({ item }) => <DailyReportCard report={item} />}
    />
  );
}
