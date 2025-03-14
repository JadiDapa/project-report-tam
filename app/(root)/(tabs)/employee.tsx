import {
  FlatList,
  RefreshControl,
  SafeAreaView,
  StatusBar,
  View,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import FloatingAction from "@/components/tabs/home/FloatingAction";
import SearchInput from "@/components/tabs/home/SearchInput";
import { useQuery } from "@tanstack/react-query";
import { getAllAccounts } from "@/lib/network/account";
import EmployeeRoleSelect from "@/components/tabs/employee/EmployeeRoleSelect";
import EmployeeCard from "@/components/tabs/employee/EmployeeCard";
import EmployeeHeader from "@/components/tabs/employee/EmployeeHeader";

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
      account.role!.toLowerCase() === selectedRole.toLowerCase();

    return matchesSearch && matchesRole;
  });

  return (
    <SafeAreaView className="flex-1 bg-primary-50">
      <View className="pt-8">
        <StatusBar backgroundColor="#eceffb" />
        <FloatingAction />
        <EmployeeHeader />
        <SearchInput query={accountQuery} setQuery={setAccountQuery} />
        <EmployeeRoleSelect
          selectedRole={selectedRole}
          setSelectedRole={setSelectedRole}
        />

        <FlatList
          data={filteredAccounts}
          keyExtractor={(account) => account.id.toString()}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          renderItem={({ item: account }) => <EmployeeCard account={account} />}
        />
      </View>
    </SafeAreaView>
  );
}
