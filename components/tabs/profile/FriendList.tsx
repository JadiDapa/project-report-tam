import { View, Text, TextInput, FlatList, Image } from "react-native";
import React from "react";
import AntDesign from "@expo/vector-icons/AntDesign";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

interface FriendType {
  username: string;
  points: string;
}

const friendList: FriendType[] = [
  { username: "Suki Jaya", points: "230" },
  { username: "Budi Budbud", points: "752" },
  { username: "Rahmat Tahulu", points: "120" },
  { username: "Bambang Siregar", points: "114" },
  { username: "Lorem Barawa", points: "938" },
  { username: "Teman 1", points: "752" },
  { username: "Teman 2", points: "120" },
  { username: "Teman 3", points: "114" },
  { username: "Teman 4", points: "938" },
];

export default function FriendList() {
  return (
    <FlatList
      data={friendList}
      className="p-4"
      keyExtractor={(item) => item.username}
      renderItem={({ item: friend }) => <FriendCard friend={friend} />}
      ListHeaderComponent={() => (
        <View className="flex-row items-center justify-between">
          <Text className="font-cereal-medium">261 Friend List</Text>
          <View className="flex-row gap-2">
            <View className="flex items-center justify-center bg-white border rounded-lg size-10 border-slate-200">
              <AntDesign name="search1" size={18} color="black" />
            </View>
            <View className="flex items-center justify-center bg-white border rounded-lg size-10 border-slate-200">
              <Ionicons name="people-outline" size={18} color="black" />
            </View>
          </View>
        </View>
      )}
      showsVerticalScrollIndicator={false}
    />
  );
}

export function FriendCard({ friend }: { friend: FriendType }) {
  return (
    <View className="flex-row items-center justify-between gap-4 p-4 mt-2 bg-white shadow-md rounded-xl">
      <View className="flex flex-row items-center gap-4">
        <View className="relative overflow-hidden rounded-full size-12">
          <Image
            source={{
              uri: "https://avatars.githubusercontent.com/u/119063058?v=4",
            }}
            className="object-cover object-center w-full h-full"
          />
        </View>
        <View>
          <Text className="text-lg font-cereal-medium">{friend.username}</Text>
          <Text className="text-sm font-cereal text-slate-400">
            {friend.points} Points
          </Text>
        </View>
      </View>
      <View className="relative items-center justify-center border border-slate-300 size-10 rounded-xl">
        <MaterialIcons name="chat-bubble-outline" size={18} color="black" />
      </View>
    </View>
  );
}
