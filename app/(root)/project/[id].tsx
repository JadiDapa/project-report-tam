import LoadingScreen from "@/components/LoadingScreen";
import ProgressReports from "@/components/project/detail/ProgressReports";
import ProjectDetailHeader from "@/components/project/detail/ProjectDetailHeader";
import ProjectEmployees from "@/components/project/detail/ProjectEmployees";
import ProjectInfo from "@/components/project/detail/ProjectInfo";
import { getProjectById } from "@/lib/network/project";
import { useAuth } from "@clerk/clerk-expo";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import { SafeAreaView, StatusBar } from "react-native";

export default function ProjectDetail() {
  const { id } = useLocalSearchParams();

  const { getToken } = useAuth();

  const { data: project } = useQuery({
    queryFn: () => getProjectById(id as string, getToken),
    queryKey: ["project", id],
  });

  if (!project) return <LoadingScreen />;

  return (
    <SafeAreaView className="flex-1 bg-primary-50">
      <ProgressReports
        projectId={id as string}
        reports={project.Reports}
        listHeader={
          <>
            <StatusBar backgroundColor="#eceffb" />
            <ProjectDetailHeader />
            <ProjectInfo
              title={project?.title}
              description={project?.description}
              startDate={project?.startDate}
              endDate={project?.endDate}
            />
            <ProjectEmployees employees={project?.Employees} />
          </>
        }
      />
    </SafeAreaView>
  );
}
