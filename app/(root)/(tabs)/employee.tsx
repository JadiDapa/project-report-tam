import { FlatList, RefreshControl, View } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import SearchInput from "@/components/tabs/home/SearchInput";
import { useQuery } from "@tanstack/react-query";
import { getAllAccounts } from "@/lib/network/account";
import EmployeeRoleSelect from "@/components/tabs/employee/EmployeeRoleSelect";
import EmployeeCard from "@/components/tabs/employee/EmployeeCard";
import TabScreenHeader from "@/components/tabs/TabScreenHeader";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

export default function Employee() {
  const [refreshing, setRefreshing] = useState(false);
  const [accountQuery, setAccountQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");

  const { data: accounts, refetch } = useQuery({
    queryFn: () => getAllAccounts(),
    queryKey: ["accounts"],
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
  }, [refreshing, refetch]);

  if (!accounts) return null;

  const filteredAccounts = accounts.filter((account) => {
    const matchesSearch = account.fullname
      .toLowerCase()
      .includes(accountQuery.toLowerCase());

    const matchesRole =
      selectedRole === "all" ||
      account.Role.name!.toLowerCase() === selectedRole.toLowerCase();

    return matchesSearch && matchesRole;
  });

  return (
    <SafeAreaView className="flex-1 bg-primary-50">
      <StatusBar backgroundColor="#2d52d2" />
      <TabScreenHeader title="Employees" />

      <FlatList
        data={filteredAccounts}
        keyExtractor={(account) => account.id.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListHeaderComponent={
          <>
            <SearchInput query={accountQuery} setQuery={setAccountQuery} />
            <EmployeeRoleSelect
              selectedRole={selectedRole}
              setSelectedRole={setSelectedRole}
            />
          </>
        }
        renderItem={({ item: account }) => <EmployeeCard account={account} />}
      />
    </SafeAreaView>
  );
}
