import EmployeeDetailHeader from "@/components/employee/EmployeeDetailHeader";
import EmployeeMenuSelect from "@/components/employee/EmployeeMenuSelect";
import LoadingScreen from "@/components/LoadingScreen";
import ReportCard from "@/components/report/ReportCard";
import ProfileInfo from "@/components/tabs/profile/ProfileInfo";
import ProjectCard from "@/components/tabs/projects/ProjectCard";
import { getAccountById } from "@/lib/network/account";
import { ProjectType } from "@/lib/types/project";
import { ReportType } from "@/lib/types/report";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import { useCallback, useState } from "react";
import {
  FlatList,
  RefreshControl,
  SafeAreaView,
  StatusBar,
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
    <>
      <EmployeeDetailHeader />
      <ProfileInfo account={account} />
      <EmployeeMenuSelect
        selectedMenu={selectedMenu}
        setSelectedMenu={setSelectedMenu}
      />
    </>
  );

  return (
    <SafeAreaView className="flex-1 bg-primary-50">
      <StatusBar backgroundColor="#eceffb" />
      {selectedMenu === "projects" ? (
        <ProjectList
          projects={account.Projects ?? []}
          header={headerContent}
          isFetching={isFetching}
          onRefresh={onRefresh}
        />
      ) : (
        <ReportList
          reports={account.Reports ?? []}
          header={headerContent}
          isFetching={isFetching}
          onRefresh={onRefresh}
        />
      )}
    </SafeAreaView>
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
  reports: ReportType[];
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
      renderItem={({ item }) => <ReportCard report={item} />}
    />
  );
}
