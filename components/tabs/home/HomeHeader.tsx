import { View, Text, Pressable } from "react-native";
import React, { useEffect } from "react";
import Feather from "@expo/vector-icons/Feather";
import { useAuth, useClerk, useUser } from "@clerk/clerk-expo";
import { DoorOpen } from "lucide-react-native";
import { useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { getAccountByEmail } from "@/lib/network/account";

export default function HomeHeader() {
  const { signOut } = useClerk();
  const { user } = useUser();

  const router = useRouter();

  const { data: account } = useQuery({
    queryFn: () =>
      getAccountByEmail(user?.primaryEmailAddress?.emailAddress || ""),
    queryKey: ["account"],
  });

  async function handleSignOut() {
    try {
      await signOut();
      router.replace("/auth");
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <View className="flex flex-row items-center justify-between px-6 ">
      <View className="">
        <Text className="text-sm font-cereal-medium">Good Morning,</Text>

        <Text className="text-2xl/tight text-primary-500 font-cereal-bold">
          {account?.fullname}
        </Text>
      </View>
      <View className="flex flex-row items-center gap-4">
        <View className="items-center justify-center border rounded-full border-slate-400 size-10 ">
          <Feather name="bell" size={24} color="#57595f" />
        </View>
        <Pressable
          onPress={handleSignOut}
          className="items-center justify-center border rounded-full border-slate-400 size-10 "
        >
          <DoorOpen size={24} color="#57595f" />
        </Pressable>
        <View className="items-center justify-center border rounded-full border-slate-400 size-10 ">
          <Text className="text-slate-500 font-cereal-bold">DP</Text>
        </View>
      </View>
    </View>
  );
}
