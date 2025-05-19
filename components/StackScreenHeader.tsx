import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { useRouter } from "expo-router";
import {
  ArrowLeft,
  ArrowLeftCircle,
  ChevronLeft,
  Home,
  X,
} from "lucide-react-native";
import { View, Text, Pressable, StatusBar } from "react-native";

export default function StackScreenHeader({ title }: { title: string }) {
  const router = useRouter();
  return (
    <View className="flex-row items-center justify-between gap-4 px-6 py-6 bg-primary-500">
      <Pressable onPress={() => router.back()}>
        <FontAwesome6 name="arrow-left-long" size={20} color="white" />
      </Pressable>

      <Text className="text-xl text-white font-cereal-medium">{title}</Text>

      <Pressable onPress={() => router.push("/")}>
        <Entypo name="home" size={20} color="white" />
      </Pressable>
    </View>
  );
}
