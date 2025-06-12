import ActivityList from "@/components/tabs/home/ActivityList";
import HomeHeader from "@/components/tabs/home/HomeHeader";
import HomeSearchInput from "@/components/tabs/home/HomeSearchInput";
import MenuShortcut from "@/components/tabs/home/MenuShortcut";
import ProjectList from "@/components/tabs/home/ProjectList";
import UserList from "@/components/tabs/home/UserList";
import { useCallback, useState } from "react";
import { RefreshControl, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

export default function Home() {
  const [refreshing, setRefreshing] = useState(false);
  const [query, setQuery] = useState("");

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-primary-50" edges={["top"]}>
      <StatusBar style="light" backgroundColor="#2d52d2" />
      <ScrollView
        contentContainerStyle={{ paddingBottom: 120 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <HomeHeader />
        <HomeSearchInput query={query} setQuery={setQuery} />
        <MenuShortcut />
        <ActivityList />
        <ProjectList refreshing={refreshing} />
        <UserList />
      </ScrollView>
    </SafeAreaView>
  );
}
