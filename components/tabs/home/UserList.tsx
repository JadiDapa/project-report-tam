import React from "react";
import { useRouter } from "expo-router";
import { View, Text, FlatList, Pressable } from "react-native";

export const users = [
  {
    id: 1,
    username: "Employee No-1",
    image: "U1",
  },
  {
    id: 2,
    username: "Employee No-2",
    image: "U2",
  },
  {
    id: 3,
    username: "Employee No-3",
    image: "U3",
  },
  {
    id: 4,
    username: "Employee No-4",
    image: "U4",
  },
];

export default function UserList() {
  const router = useRouter();

  return (
    <View className="mt-6">
      {/* Header placed separately */}
      <View className="flex-row items-center justify-between px-6">
        <Text className="text-lg font-cereal-medium">Other Employee</Text>
        <View className="border rounded-full px-3 py-0.5">
          <Text className="text-sm font-cereal-medium">View All</Text>
        </View>
      </View>

      <FlatList
        data={users}
        horizontal
        className="mt-2 ps-6"
        showsHorizontalScrollIndicator={false}
        keyExtractor={(user) => user.id.toString()}
        renderItem={({ item: user }) => (
          <Pressable
            onPress={() => router.push(`/`)}
            className="items-center justify-center w-24 p-2 border border-slate-500 me-3 rounded-xl"
          >
            <View className="items-center justify-center rounded-full bg-primary-300 size-16">
              <Text className="text-xl text-white font-cereal-medium">
                {user.image}
              </Text>
            </View>
            <Text className="mt-1 text-xs text-center capitalize font-cereal-medium">
              {user.username}
            </Text>
          </Pressable>
        )}
      />
    </View>
  );
}
