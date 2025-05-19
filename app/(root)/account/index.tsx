import {
  FlatList,
  RefreshControl,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { useCallback, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import SearchInput from "@/components/tabs/home/SearchInput";
import StackScreenHeader from "@/components/StackScreenHeader";
import { getAllAccounts } from "@/lib/network/account";
import EmployeeCard from "@/components/tabs/employee/EmployeeCard";
import BottomButton from "@/components/BottomButton";
import { router } from "expo-router";
import { useAccount } from "@/contexts/AccountContexts";

export default function Accounts() {
  const [refreshing, setRefreshing] = useState(false);
  const [accountQuery, setAccountQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");

  const { account } = useAccount();

  const isAccountManager = account?.Role?.Features?.some((feature) => {
    return feature.name === "Manage Account";
  });

  useEffect(() => {
    if (account && !isAccountManager) {
      router.replace("/");
    }
  }, [account, isAccountManager]);

  const { data: accounts, refetch } = useQuery({
    queryFn: () => getAllAccounts(),
    queryKey: ["accounts"],
  });

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refetch();
    } finally {
      setRefreshing(false);
    }
  }, [refetch]);

  const filteredAccounts = accounts?.filter((account) => {
    const matchesSearch = account.fullname
      .toLowerCase()
      .includes(accountQuery.toLowerCase());

    const matchesRole =
      selectedRole === "all" ||
      account.Role.name!.toLowerCase() === selectedRole.toLowerCase();

    return matchesSearch && matchesRole;
  });

  return (
    <SafeAreaView className="relative flex-1 bg-primary-50">
      <StatusBar backgroundColor="#2d52d2" />

      <StackScreenHeader title="Account List" />

      <SearchInput query={accountQuery} setQuery={setAccountQuery} />

      <FlatList
        data={filteredAccounts}
        keyExtractor={(account) => account.id.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        renderItem={({ item: account }) => <EmployeeCard account={account} />}
      />
      {isAccountManager && (
        <BottomButton
          text="Add New Account"
          onPress={() => router.push("/account/create")}
        />
      )}
    </SafeAreaView>
  );
}
