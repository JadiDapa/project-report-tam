import { useEffect, useState } from "react";
import { Progress, ProgressFilledTrack } from "@/components/ui/progress";
import { useRouter } from "expo-router";
import { View, Text, FlatList, Pressable } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { useQuery } from "@tanstack/react-query";
import { getProjectsByAccountId } from "@/lib/network/project";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { format } from "date-fns";
import { useAccount } from "@/contexts/AccountContexts";

interface ProjectListProps {
  refreshing: boolean;
}

export default function ProjectList({ refreshing }: ProjectListProps) {
  const { getToken } = useAuth();

  const { account } = useAccount();

  const [selectedStatus, setSelectedStatus] = useState("All");
  const [projectQuery, setProjectQuery] = useState("");

  const { data: projects, refetch } = useQuery({
    queryFn: () => getProjectsByAccountId(account!.id.toString(), getToken),
    queryKey: ["projects"],
  });

  useEffect(() => {
    if (refreshing) {
      refetch();
    }
  }, [refreshing, refetch]);

  const router = useRouter();

  if (!projects) return null;

  const filteredProjects = projects.filter((project) => {
    const matchesSearch = project.title
      .toLowerCase()
      .includes(projectQuery.toLowerCase());

    const matchesRole =
      selectedStatus === "All" ||
      project.status.toLowerCase() === selectedStatus.toLowerCase();

    return matchesSearch && matchesRole;
  });

  if (!account) return <Text>No account data</Text>;

  return (
    <View className="py-6 mt-4 bg-white">
      {/* Header placed separately */}
      <View className="flex-row items-center justify-between px-6">
        <Text className="text-lg font-cereal-medium">Your Projects</Text>
        <View className="border rounded-full px-3 py-0.5">
          <Text className="text-sm font-cereal-medium">View All</Text>
        </View>
      </View>

      <FlatList
        data={filteredProjects}
        horizontal
        className="mt-4 ps-6"
        showsHorizontalScrollIndicator={false}
        keyExtractor={(project) => project.id.toString()}
        renderItem={({ item: project }) => (
          <Pressable
            onPress={() =>
              router.push({
                pathname: "/project/[id]",
                params: { id: project.id },
              })
            }
            className=" w-[88vw] me-4  p-4 py-5 bg-primary-50 rounded-xl border-2 border-primary-100"
          >
            <View className="flex-row justify-between gap-2">
              <Text className="flex-1 line-clamp-2 font-cereal-bold">
                {project.title}
              </Text>
              <View className="items-center justify-center w-16 h-6 rounded-full bg-primary-100">
                <Text className="text-sm capitalize font-cereal-medium text-primary-600">
                  {project.status}
                </Text>
              </View>
            </View>
            <Text className="mt-1 text-sm font-cereal line-clamp-2">
              {project.description}
            </Text>

            <Progress
              className="w-full mt-3"
              value={Math.random() * 100}
              size={"sm"}
            >
              <ProgressFilledTrack />
            </Progress>
            <View className="flex-row items-center gap-2 mt-3">
              <View className="flex-row items-center gap-1">
                <Feather name="calendar" size={16} color="" />
                <Text className="text-primary-800 font-cereal">
                  Due {format(project.endDate, "dd MMMM yyyy")}
                </Text>
              </View>
              <View className="rounded-full size-1 bg-primary-500" />
              <View className="flex-row items-center gap-1">
                <Feather name="users" size={16} color="" />
                <Text className="text-primary-800 font-cereal">
                  {0} Employees
                </Text>
              </View>
            </View>
          </Pressable>
        )}
      />
    </View>
  );
}
