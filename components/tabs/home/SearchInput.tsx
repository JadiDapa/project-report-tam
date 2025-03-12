import { View, TextInput } from "react-native";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Feather from "@expo/vector-icons/Feather";

export default function SearchInput() {
  return (
    <View className="flex flex-row items-center justify-between gap-4 px-6 mt-6">
      <View className="relative flex-1 overflow-hidden border rounded-full border-slate-400 bg-slate-50">
        <Feather
          name="search"
          className="absolute -translate-y-1/2 top-1/2 left-3"
          size={20}
          color="slate"
        />
        <TextInput className="py-3 ps-12" placeholder="Search Anything..." />
      </View>
      <View className="items-center justify-center border rounded-full bg-slate-50 border-slate-400 size-12 ">
        <FontAwesome6 name="sliders" size={20} color="slate" />
      </View>
    </View>
  );
}
