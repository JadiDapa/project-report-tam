import {
  FlatList,
  RefreshControl,
  SafeAreaView,
  StatusBar,
  View,
  Text,
} from "react-native";
import { useCallback, useEffect, useState } from "react";
import FloatingAction from "@/components/tabs/home/FloatingAction";
import ProjectHeader from "@/components/tabs/projects/ProjectHeader";
import StatusSelect from "@/components/tabs/projects/StatusSelect";
import { useAuth } from "@clerk/clerk-expo";
import { useQuery } from "@tanstack/react-query";
import { getAllProjects } from "@/lib/network/project";
import ProjectCard from "@/components/tabs/projects/ProjectCard";
import SearchInput from "@/components/tabs/home/SearchInput";
import TabScreenHeader from "@/components/tabs/TabScreenHeader";

export default function Project() {
  const { getToken } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [projectQuery, setProjectQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const { data: projects, refetch } = useQuery({
    queryFn: () => getAllProjects(getToken),
    queryKey: ["projects"],
  });

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  useEffect(() => {
    if (refreshing) {
      refetch();
    }
  }, [refreshing]);

  if (!projects) return null;

  const filteredProjects = projects.filter((project) => {
    const matchesSearch = project.title
      .toLowerCase()
      .includes(projectQuery.toLowerCase());

    const matchesRole =
      selectedStatus === "all" ||
      project.status.toLowerCase() === selectedStatus.toLowerCase();

    return matchesSearch && matchesRole;
  });

  return (
    <SafeAreaView className="relative flex-1 bg-primary-50">
      <StatusBar backgroundColor="#2d52d2" />
      <TabScreenHeader title="Projects" />
      <View className="">
        <SearchInput query={projectQuery} setQuery={setProjectQuery} />
        <StatusSelect
          status={selectedStatus}
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
      </View>
    </SafeAreaView>
  );
}
