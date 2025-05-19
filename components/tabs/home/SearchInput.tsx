import { View, TextInput } from "react-native";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Feather from "@expo/vector-icons/Feather";
import { Dispatch } from "react";
import { SlidersHorizontal } from "lucide-react-native";

interface SearchInputProps {
  query: string;
  setQuery: Dispatch<React.SetStateAction<string>>;
}

export default function SearchInput({ query, setQuery }: SearchInputProps) {
  return (
    <View className="flex flex-row items-center justify-between gap-4 px-6 mt-6">
      <View className="relative flex-1 overflow-hidden border rounded-md border-slate-400 ">
        <Feather
          name="search"
          className="absolute -translate-y-1/2 top-1/2 left-3"
          size={20}
          color="#494949ed"
        />
        <TextInput
          className="py-3 ps-12"
          placeholder="Search Anything..."
          value={query}
          onChangeText={setQuery}
        />
      </View>
      <View className="items-center justify-center border rounded-md border-slate-400 size-12 ">
        <SlidersHorizontal size={20} color="#494949ed" />
      </View>
    </View>
  );
}
