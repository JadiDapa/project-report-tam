import React from "react";
import { View, Text } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { format } from "date-fns";
import { ProgramType } from "@/lib/types/program";
import { statuses } from "../project/create/CreateProjectForm";

export default function ProgramHeader({ program }: { program: ProgramType }) {
  const status = statuses.find((s) => s.value === program.status);

  return (
    <View className="p-6 bg-white shadow-md rounded-b-2xl">
      {/* Title + Status */}
      <View className="flex-row items-start justify-between">
        <Text className="flex-1 pr-3 text-2xl font-cereal-bold text-primary-900">
          {program.title}
        </Text>

        <View
          className={`flex-row items-center gap-1 px-3 py-1 rounded-full ${
            status?.bg ?? "bg-gray-300"
          }`}
        >
          <Feather name="activity" size={14} color="white" />
          <Text className="text-xs text-white capitalize font-cereal-medium">
            {program.status}
          </Text>
        </View>
      </View>

      {/* Description */}
      {program.description ? (
        <Text className="mt-3 text-base leading-relaxed text-gray-600 font-cereal">
          {program.description}
        </Text>
      ) : (
        <Text className="mt-3 italic text-gray-400">
          No description available.
        </Text>
      )}

      {/* Info bar */}
      <View className="flex-row flex-wrap items-center gap-3 mt-5">
        {/* Date */}
        <View className="flex-row items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-full">
          <Feather name="calendar" size={16} color="#2563EB" />
          <Text className="text-sm font-cereal text-primary-800">
            {program.createdAt
              ? format(program.createdAt, "dd MMM yyyy")
              : "Unknown date"}
          </Text>
        </View>

        {/* Total Projects */}
        <View className="flex-row items-center gap-2 bg-primary-100 px-3 py-1.5 rounded-full">
          <Feather name="layers" size={16} color="#1D4ED8" />
          <Text className="text-sm font-cereal-bold text-primary-800">
            {program.Projects?.length || 0} Projects
          </Text>
        </View>
      </View>
    </View>
  );
}
