import { Dispatch, useState } from "react";
import { View, Text, Pressable, FlatList } from "react-native";

const statuses = [
  { label: "All", value: "all" },
  { label: "Low", value: "low" },
  { label: "Medium", value: "medium" },
  { label: "High", value: "high" },
  { label: "Finished", value: "Finished" },
  { label: "Pending", value: "Pending" },
];

interface StatusSelectProps {
  status: string;
  setSelectedStatus: Dispatch<React.SetStateAction<string>>;
}

export default function StatusSelect({
  status,
  setSelectedStatus,
}: StatusSelectProps) {
  return (
    <FlatList
      data={statuses}
      horizontal
      className="mt-2 ps-6"
      showsHorizontalScrollIndicator={false}
      keyExtractor={(project) => project.label.toString()}
      renderItem={({ item }) => (
        <Pressable
          onPress={() => setSelectedStatus(item.value)}
          className={`items-center justify-center border  me-2  h-8 px-4 py-1 mt-3 w-24 rounded-full ${
            status === item.value
              ? "bg-primary-500 border-primary-500"
              : "border-slate-500"
          }`}
        >
          <Text
            className={`font-cereal-medium ${
              status === item.value ? "text-white" : "text-slate-500"
            }`}
          >
            {item.label}
          </Text>
        </Pressable>
      )}
    />
  );
}
