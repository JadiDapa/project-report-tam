import { useState } from "react";
import { View, Text, Pressable, TouchableOpacity } from "react-native";
import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
} from "@/components/ui/actionsheet";
import { Check, Plus } from "lucide-react-native";
import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import { getAllFeatures } from "@/lib/network/feature";

interface SelectFeaturesProps {
  value: number[];
  onChange: (value: number[]) => void;
}

export default function SelectFeatures({
  value,
  onChange,
}: SelectFeaturesProps) {
  const [showActionsheet, setShowActionsheet] = useState(false);
  const { data: features } = useQuery({
    queryFn: () => getAllFeatures(),
    queryKey: ["features"],
  });

  return (
    <Pressable onPress={() => setShowActionsheet(true)}>
      <View className="relative w-full px-5 py-5 border border-gray-300 rounded-md">
        <Text
          className={`${
            value.length > 0 ? "" : "text-slate-400"
          } font-cereal-regular `}
        >
          {value.length > 0
            ? value.length + " Feature Selected"
            : "Select Features"}
        </Text>
      </View>
      <Actionsheet
        isOpen={showActionsheet}
        onClose={() => setShowActionsheet(false)}
      >
        <ActionsheetBackdrop />
        <ActionsheetContent>
          <ActionsheetDragIndicatorWrapper>
            <ActionsheetDragIndicator />
          </ActionsheetDragIndicatorWrapper>
          <View className="relative flex-col items-center justify-center w-full gap-2 mt-4 ">
            <View className="flex flex-row items-center gap-3">
              <Text className="text-lg font-cereal-medium ">
                Select Features
              </Text>
              <View className="flex items-center justify-center rounded-full size-8 bg-primary-200">
                <Text className="text-lg text-white font-cereal-bold">
                  {value.length}
                </Text>
              </View>
            </View>
            <View className="w-full">
              {features?.map((feature) => {
                const isSelected = value.includes(feature.id);
                return (
                  <TouchableOpacity
                    key={feature.id}
                    onPress={() => {
                      const newValue = isSelected
                        ? value.filter((v) => v !== feature.id)
                        : [...value, feature.id];
                      onChange(newValue);
                    }}
                    className={`w-full flex-row justify-between py-4 px-4 ${
                      isSelected ? "bg-blue-100" : ""
                    } border-b border-slate-200`}
                  >
                    <Text
                      className={`text-center font-cereal-regular ${
                        isSelected ? "text-blue-600 font-bold" : ""
                      }`}
                    >
                      {feature.name}
                    </Text>
                    <Check
                      size={20}
                      color={isSelected ? "#3B82F6" : "transparent"}
                    />
                  </TouchableOpacity>
                );
              })}
              <TouchableOpacity
                onPress={() =>
                  router.push({
                    pathname: "/feature/create",
                  })
                }
                className={`w-full gap-2 flex flex-row justify-center py-4 border border-dashed border-slate-300 rounded-md`}
              >
                <Text className="text-center font-cereal-medium">
                  Add New Features
                </Text>
                <Plus size={20} color="black" />
              </TouchableOpacity>
            </View>
          </View>
        </ActionsheetContent>
      </Actionsheet>
    </Pressable>
  );
}
