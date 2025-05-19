import { FlatList, SafeAreaView, StatusBar } from "react-native";
import { useState } from "react";
import StackScreenHeader from "@/components/StackScreenHeader";
import BottomButton from "@/components/BottomButton";
import { router } from "expo-router";
import ProjectFilter from "@/components/project/ProjectFilter";
import { useAccount } from "@/contexts/AccountContexts";
import {
  List,
  ClipboardEdit,
  Ticket,
  Users,
  ListCheck,
  ClipboardList,
  Tickets,
  TicketCheck,
} from "lucide-react-native";
import { AccountType } from "@/lib/types/account";
import FeatureCard from "@/components/feature/FeatureCard";
import FeatureFilter from "@/components/feature/FeatureFilter";

export default function SearchFeatures() {
  const [projectQuery, setAccountQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const { account } = useAccount();

  const features = [
    {
      name: "My Projects",
      icon: List,
      category: "",
      route: `/project/account/${account?.id}`,
    },
    {
      name: "My Daily Reports",
      icon: ClipboardEdit,
      category: "",
      route: `/daily-report/account/${account?.id}`,
    },
    {
      name: "My Tickets",
      icon: Ticket,
      category: "",
      route: `/ticket/requester/${account?.id}`,
    },
    {
      name: "Employee List",
      icon: Users,
      category: "",
      route: "/account",
    },
    {
      name: "All Projects",
      icon: ListCheck,
      category: "Management",
      route: `/project`,
      requiredFeature: "Manage Project",
    },
    {
      name: "All Daily Reports",
      icon: ClipboardList,
      category: "Management",
      route: `/daily-report`,
      requiredFeature: "Manage Daily Report",
    },
    {
      name: "Manage Tickets",
      icon: Tickets,
      category: "Management",
      route: `/ticket`,
      requiredFeature: "Manage Ticket",
    },
    {
      name: "Assigned Ticket",
      icon: TicketCheck,
      category: "",
      route: `/ticket/handler/${account?.id}`,
      requiredFeature: "Handle Ticket",
    },
  ];

  function hasFeature(
    account: AccountType | null | undefined,
    featureName: string
  ): boolean {
    return !!account?.Role?.Features?.some(
      (feature) => feature.name === featureName
    );
  }

  const filteredFeatures = features
    ?.filter((project) => {
      const matchesQuery = project.name
        .toLowerCase()
        .includes(projectQuery.toLowerCase());
      const matchesStatus = selectedCategory
        ? project.category.toLowerCase() === selectedCategory.toLowerCase()
        : true;
      return matchesQuery && matchesStatus;
    })
    .filter((item) => {
      return !item.requiredFeature || hasFeature(account, item.requiredFeature);
    });

  return (
    <SafeAreaView className="relative flex-1 bg-white">
      <StatusBar backgroundColor="#2d52d2" />

      <StackScreenHeader title="All Projects" />

      <FeatureFilter
        query={projectQuery}
        setQuery={setAccountQuery}
        setSelectedCategory={setSelectedCategory}
        selectedCategory={selectedCategory}
      />

      <FlatList
        data={filteredFeatures}
        className="mt-4"
        keyExtractor={(feature) => feature.name.toString()}
        renderItem={({ item: feature }) => <FeatureCard feature={feature} />}
      />
    </SafeAreaView>
  );
}
