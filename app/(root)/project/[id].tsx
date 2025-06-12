import LoadingScreen from "@/components/LoadingScreen";
import ProgressReports from "@/components/project/detail/ProgressReports";
import ProjectEmployees from "@/components/project/detail/ProjectEmployees";
import ProjectInfo from "@/components/project/detail/ProjectInfo";
import StackScreenHeader from "@/components/StackScreenHeader";
import { getProjectById } from "@/lib/network/project";
import { useAuth } from "@clerk/clerk-expo";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { router, useLocalSearchParams } from "expo-router";
import { Pressable, SafeAreaView, StatusBar, Text, View } from "react-native";

export default function ProjectDetail() {
  const { id } = useLocalSearchParams();

  const { getToken } = useAuth();

  const { data: project } = useQuery({
    queryFn: () => getProjectById(id as string, getToken),
    queryKey: ["project", id],
  });

  if (!project) return <LoadingScreen />;

  return (
    <SafeAreaView className="flex-1 bg-primary-50 ">
      <ProgressReports
        project={project}
        reports={project.Reports}
        listHeader={
          <>
            <StatusBar backgroundColor="#2d52d2" />
            <StackScreenHeader title="Project Detail" />
            <ProjectInfo
              id={project?.id}
              title={project?.title}
              description={project?.description}
              startDate={format(project.startDate, "MMM, dd yyyy")}
              endDate={format(project.endDate, "MMM, dd yyyy")}
            />
            <ProjectEmployees
              employees={project?.Employees}
              isModifiable={false}
            />
          </>
        }
      />

      <View className="absolute bottom-0 w-full px-6 py-4 bg-white border-t shadow-md border-slate-200">
        <Pressable
          onPress={() => {
            router.push({
              pathname: "/report/create/[projectId]",
              params: { projectId: project.id },
            });
          }}
        >
          <Text className="px-6 py-4 text-lg text-center text-white rounded-md shadow-lg font bg-primary-500 font-cereal-medium shadow-primary-500/50">
            Add New Report
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
