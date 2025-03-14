import { View, Text, Pressable, Image } from "react-native";
import React from "react";
import { router } from "expo-router";
import { AccountType } from "@/lib/types/account";
import { Briefcase, ClipboardPen } from "lucide-react-native";
import { getInitials } from "@/lib/getInitials";

export default function EmployeeCard({ account }: { account: AccountType }) {
  console.log(account);
  return (
    <View className="px-6 mt-4">
      <Pressable
        onPress={() =>
          router.push({
            pathname: "/employee/[id]",
            params: { id: account.id },
          })
        }
        className="flex flex-row items-center w-full gap-4 p-4 bg-white shadow-md rounded-xl"
      >
        <View className="items-center justify-center rounded-full bg-primary-300 size-14">
          {account.image ? (
            <Image
              src={account.image}
              className="w-full h-full "
              resizeMode="cover"
            />
          ) : (
            <Text className="text-xl text-white font-cereal-medium">
              {getInitials(account.fullname)}
            </Text>
          )}
        </View>
        <View className="flex-1">
          <View className="flex-row justify-between w-full">
            <Text className="text-lg font-cereal-medium">
              {account.fullname}
            </Text>
            <View className="items-center justify-center h-6 px-2 rounded-full bg-primary-100">
              <Text className="text-sm capitalize font-cereal-medium">
                {account.role === "user" ? "employee" : account.role}
              </Text>
            </View>
          </View>

          <View className="flex-row items-center justify-between gap-2 mt-2">
            <View className="flex-row items-center gap-1">
              <Briefcase size={14} color="#2d52d2" />
              <Text className="text-sm text-primary-800 font-cereal">
                {account.Projects?.length} Projects
              </Text>
            </View>
            <View className="flex-row items-center gap-1">
              <ClipboardPen size={14} color="#2d52d2" />
              <Text className="text-sm text-primary-800 font-cereal">
                {account.Reports?.length} Reports
              </Text>
            </View>
          </View>
        </View>
      </Pressable>
    </View>
  );
}
