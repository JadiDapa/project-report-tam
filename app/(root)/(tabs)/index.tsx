import ActivityList from "@/components/tabs/home/ActivityList";
import FloatingAction from "@/components/tabs/home/FloatingAction";
import HomeHeader from "@/components/tabs/home/HomeHeader";
import MenuShortcut from "@/components/tabs/home/MenuShortcut";
import ProjectList from "@/components/tabs/home/ProjectList";
import SearchInput from "@/components/tabs/home/SearchInput";
import UserList from "@/components/tabs/home/UserList";
import { SafeAreaView, ScrollView, StatusBar, View } from "react-native";

export const habits = [
  { icon: "🏋️", name: "WorkOut", progress: "8", target: "100" },
  { icon: "🍽️", name: "Cooking", progress: "6", target: "100" },
  { icon: "📚", name: "Reading", progress: "7", target: "100" },
  { icon: "💪", name: "Gym", progress: "9", target: "10" },
  { icon: "🏃‍♂️", name: "Running", progress: "7", target: "10" },
  { icon: "🎨", name: "Painting", progress: "5", target: "100" },
  { icon: "⚡️", name: "Electricity", progress: "9", target: "10" },
  { icon: "🏠", name: "Home", progress: "10", target: "100" },
  { icon: "💼", name: "Office", progress: "10", target: "100" },
];

export default function Home() {
  return (
    <SafeAreaView className="flex-1 bg-primary-50">
      <ScrollView
        className="flex-1 py-8"
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        <StatusBar backgroundColor="#eceffb" />
        <HomeHeader />
        <SearchInput />
        <MenuShortcut />
        <ProjectList />
        <UserList />
        <ActivityList />
      </ScrollView>
      <FloatingAction />
    </SafeAreaView>
  );
}
