import { useRouter } from "expo-router";
import { ChevronLeft, X } from "lucide-react-native";
import { View, Text, Pressable } from "react-native";

export default function EmployeeDetailHeader() {
  const router = useRouter();
  return (
    <View className="flex-row items-center justify-between gap-4 px-6 ">
      <Pressable
        onPress={() => router.back()}
        className="items-center justify-center p-1 border rounded-xl size-8"
      >
        <ChevronLeft size={18} color="black" />
      </Pressable>

      <Text className="text-xl font-cereal-medium text-primary-500">
        Employee Detail
      </Text>

      <Pressable
        onPress={() => router.push("/")}
        className="items-center justify-center p-1 border rounded-xl size-8"
      >
        <X size={18} color="black" />
      </Pressable>
    </View>
  );
}
