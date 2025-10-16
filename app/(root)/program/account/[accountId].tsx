import {
  FlatList,
  RefreshControl,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { useCallback, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import StackScreenHeader from "@/components/StackScreenHeader";
import { useLocalSearchParams } from "expo-router";
import { getProjectsByAccountId } from "@/lib/network/project";
import { useAuth } from "@clerk/clerk-expo";
import ProjectCard from "@/components/tabs/projects/ProjectCard";
import ProjectFilter from "@/components/project/ProjectFilter";

export default function ProjectByAccount() {
  const [refreshing, setRefreshing] = useState(false);
  const [projectQuery, setAccountQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

  const { accountId } = useLocalSearchParams();

  const { getToken } = useAuth();

  const { data: projects, refetch } = useQuery({
    queryFn: () => getProjectsByAccountId(accountId.toString(), getToken),
    queryKey: ["projects", accountId],
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

      <StackScreenHeader title="Your Projects" />

      <ProjectFilter
        query={projectQuery}
        setQuery={setAccountQuery}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
      />

      <FlatList
        data={filteredProjects}
        keyExtractor={(project) => project.id.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        renderItem={({ item: project }) => <ProjectCard project={project} />}
      />
    </SafeAreaView>
  );
}
