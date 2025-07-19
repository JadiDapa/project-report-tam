import {
  FlatList,
  RefreshControl,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { useCallback, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import StackScreenHeader from "@/components/StackScreenHeader";
import BottomButton from "@/components/BottomButton";
import { router } from "expo-router";
import { getAllProjects } from "@/lib/network/project";
import { useAuth } from "@clerk/clerk-expo";
import ProjectCard from "@/components/tabs/projects/ProjectCard";
import ProjectFilter from "@/components/project/ProjectFilter";

export default function AllProjects() {
  const [refreshing, setRefreshing] = useState(false);
  const [projectQuery, setAccountQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

  const { getToken } = useAuth();

  const { data: projects, refetch } = useQuery({
    queryFn: () => getAllProjects(getToken),
    queryKey: ["projects"],
  });

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refetch();
    } finally {
      setRefreshing(false);
    }
  }, [refetch]);

  const filteredProjects = projects?.filter((project) => {
    const matchesQuery = project.title
      .toLowerCase()
      .includes(projectQuery.toLowerCase());
    const matchesStatus = selectedStatus
      ? project.status.toLowerCase() === selectedStatus.toLowerCase()
      : true;
    return matchesQuery && matchesStatus;
  });

  if (!projects) return null;

  return (
    <SafeAreaView className="relative flex-1 bg-primary-50">
      <StatusBar backgroundColor="#2d52d2" />

      <StackScreenHeader title="All Projects" />

      <ProjectFilter
        query={projectQuery}
        setQuery={setAccountQuery}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
      />

      <FlatList
        data={filteredProjects}
        contentContainerStyle={{ paddingBottom: 100 }}
        keyExtractor={(project) => project.id.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        renderItem={({ item: project }) => <ProjectCard project={project} />}
      />
      <BottomButton
        text="Add New Project"
        onPress={() => router.push("/project/create")}
      />
    </SafeAreaView>
  );
}
