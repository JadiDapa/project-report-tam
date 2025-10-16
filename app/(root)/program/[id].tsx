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
import { router, useLocalSearchParams } from "expo-router";
import { getAllProjects, getProjectsByProgramId } from "@/lib/network/project";
import { useAuth } from "@clerk/clerk-expo";
import ProjectCard from "@/components/tabs/projects/ProjectCard";
import ProjectFilter from "@/components/project/ProjectFilter";
import { getProgramById } from "@/lib/network/program";
import ProgramHeader from "@/components/program/ProgramHeader";

export default function ProgramProjects() {
  const [refreshing, setRefreshing] = useState(false);
  const [projectQuery, setAccountQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

  const { id } = useLocalSearchParams();

  const { data: projects, refetch } = useQuery({
    queryFn: () => getProjectsByProgramId(id as string),
    queryKey: ["projects"],
  });

  const { data: program } = useQuery({
    queryFn: () => getProgramById(id as string),
    queryKey: ["programs", id],
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

      {program && <ProgramHeader program={program} />}

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
      {/* <BottomButton
        text="Add New Project"
        onPress={() => router.push("/project/create")}
      /> */}
    </SafeAreaView>
  );
}
