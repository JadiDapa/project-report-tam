import { View, TextInput, Pressable, Text } from "react-native";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Feather from "@expo/vector-icons/Feather";
import { Dispatch } from "react";
import { SlidersHorizontal } from "lucide-react-native";
import { router } from "expo-router";

interface HomeSearchInputProps {
  query: string;
  setQuery: Dispatch<React.SetStateAction<string>>;
}

export default function HomeSearchInput({
  query,
  setQuery,
}: HomeSearchInputProps) {
  return (
    <Pressable
      onPress={() =>
        router.push({
          pathname: `/feature/search`,
        })
      }
      className="flex flex-row items-center justify-between gap-4 px-6 pt-6 pb-8 rounded-b-3xl bg-primary-500"
    >
      <View className="relative flex-1 overflow-hidden border border-white rounded-md">
        <Feather
          name="search"
          className="absolute -translate-y-1/2 top-1/2 left-3"
          size={20}
          color="#fff"
        />
        <Text className="py-3 text-white ps-12">Search Anything...</Text>
      </View>
      <View className="items-center justify-center border border-white rounded-md size-12 ">
        <SlidersHorizontal size={20} color="#fff" />
      </View>
    </Pressable>
  );
}
