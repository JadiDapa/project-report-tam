import { Dispatch, useState } from "react";
import { View, Pressable, Text, TextInput } from "react-native";
import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
} from "@/components/ui/actionsheet";
import { SlidersHorizontal } from "lucide-react-native";
import Feather from "@expo/vector-icons/Feather";

const status = ["Management"];

interface SearchInputProps {
  query: string;
  setQuery: Dispatch<React.SetStateAction<string>>;
  selectedCategory: string | null;
  setSelectedCategory: Dispatch<React.SetStateAction<string | null>>;
}

export default function FeatureFilter({
  query,
  setQuery,
  selectedCategory,
  setSelectedCategory,
}: SearchInputProps) {
  const [showActionsheet, setShowActionsheet] = useState(false);

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
      <Pressable
        className="items-center justify-center border rounded-md border-slate-400 size-12 "
        onPress={() => setShowActionsheet(true)}
      >
        <SlidersHorizontal size={20} color="#494949ed" />

        <Actionsheet
          isOpen={showActionsheet}
          onClose={() => setShowActionsheet(false)}
        >
          <ActionsheetBackdrop />
          <ActionsheetContent>
            <ActionsheetDragIndicatorWrapper>
              <ActionsheetDragIndicator />
            </ActionsheetDragIndicatorWrapper>
            <View className="flex-col w-full py-4">
              <View className="flex-row items-center justify-between">
                <Text className="text-xl font-cereal-medium">Filter</Text>
                <Pressable onPress={() => setSelectedCategory(null)}>
                  <Text className=" text-primary-500 font-cereal-medium">
                    Reset
                  </Text>
                </Pressable>
              </View>
              <View className="mt-4">
                <Text className="mb-2 text-lg font-cereal-medium">
                  Category
                </Text>
                <View className="flex-row flex-wrap gap-2">
                  {status.map((stats) => (
                    <Pressable
                      key={stats}
                      onPress={() =>
                        setSelectedCategory(
                          selectedCategory === stats ? null : stats
                        )
                      }
                      className={`px-6 py-2 rounded-full font-cereal-light ${
                        selectedCategory === stats
                          ? "bg-primary-500 text-white"
                          : "bg-slate-200"
                      }`}
                    >
                      <Text
                        className={
                          selectedCategory === stats
                            ? "text-white"
                            : "text-black"
                        }
                      >
                        {stats}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>
            </View>
          </ActionsheetContent>
        </Actionsheet>
      </Pressable>
    </View>
  );
}
