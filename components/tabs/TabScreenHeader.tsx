import { View, Text, Pressable, Image } from "react-native";
import React from "react";
import Feather from "@expo/vector-icons/Feather";
import { router } from "expo-router";
import { useAccount } from "@/contexts/AccountContexts";

export default function TabScreenHeader({ title }: { title: string }) {
  const { account } = useAccount();
  return (
    <View className="flex flex-row items-center justify-between px-6 pt-8 pb-4 bg-primary-500">
      <Pressable
        onPress={() => router.push("/profile")}
        className="relative items-center justify-center overflow-hidden border border-white rounded-full size-10 "
      >
        <Image
          source={{
            uri:
              account?.image ||
              "https://st3.depositphotos.com/6672868/13701/v/450/depositphotos_137014128-stock-illustration-user-profile-icon.jpg",
          }}
          className="object-cover object-center w-full h-full"
        />
      </Pressable>
      <Text className="text-xl text-white font-cereal-medium">{title}</Text>
      <View className="items-center justify-center border border-white rounded-full size-10 ">
        <Feather name="bell" size={20} color="#fff" />
      </View>
    </View>
  );
}
