import { View, Text } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { useAccount } from "@/contexts/AccountContexts";

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
        <View className="items-center justify-center border border-white rounded-full size-10 ">
          <Feather name="bell" size={24} color="#ffffff" />
        </View>

        <View className="items-center justify-center border border-white rounded-full size-10 ">
          <Text className="text-white font-cereal-bold">DP</Text>
        </View>
      </View>
    </View>
  );
}
