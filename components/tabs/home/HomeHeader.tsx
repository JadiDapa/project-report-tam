import { View, Text, Image, Pressable } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { useAccount } from "@/contexts/AccountContexts";
import { router } from "expo-router";

export default function HomeHeader() {
  const { account, loading } = useAccount();

  if (loading) return <Text>Loading account...</Text>;

  return (
    <View className="flex flex-row items-center justify-between px-6 pt-8 bg-primary-500">
      <View className="">
        <Text className="text-sm text-white font-cereal-medium">
          Good Morning,
        </Text>

        <Text className="text-white text-2xl/tight font-cereal-bold">
          {account?.fullname}
        </Text>
      </View>
      <View className="flex flex-row items-center gap-4">
        <Pressable
          onPress={() => router.push("/notification")}
          className="items-center justify-center border border-white rounded-full size-10 "
        >
          <Feather name="bell" size={24} color="#ffffff" />
        </Pressable>

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
      </View>
    </View>
  );
}
