import { View, Text, Pressable } from "react-native";
import React from "react";
import { router } from "expo-router";
import Feather from "@expo/vector-icons/Feather";
import { format } from "date-fns";
import { ProgramType } from "@/lib/types/program";

export default function ProgramCard({ program }: { program: ProgramType }) {
  const statuses = [
    {
      label: "Active",
      value: "active",
      bgColor: "bg-success-200 text-success-700 border-success-500",
      bg: "bg-success-500",
    },
    {
      label: "Pending",
      value: "pending",
      bgColor: "bg-warning-200 text-warning-700 border-warning-500",
      bg: "bg-warning-500",
    },
    {
      label: "Closed",
      value: "closed",
      bgColor: "bg-error-200 text-error-700 border-error-500",
      bg: "bg-error-500",
    },
  ];
  const status = statuses.find((s) => s.value === program.status);

  return (
    <View className="px-5 mt-5">
      <Pressable
        onPress={() =>
          router.push({
            pathname: "/program/[id]",
            params: { id: program.id },
          })
        }
        android_ripple={{ color: "#E5E7EB" }}
        className="relative w-full overflow-hidden bg-white shadow-lg rounded-3xl"
        style={{
          elevation: 5,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
        }}
      >
        {/* Accent gradient strip */}
        <View
          className={`absolute left-0 top-0 bottom-0 w-4 ${
            status?.bg ?? "bg-primary-400"
          } rounded-l-3xl`}
        />

        {/* Inner Content */}
        <View className="p-6 pl-7">
          {/* Header */}
          <View className="flex-row items-start justify-between">
            <Text
              numberOfLines={2}
              className="flex-1 pr-3 text-[20px] font-cereal-bold text-primary-900 leading-snug"
            >
              {program.title}
            </Text>

            <View
              className={`flex-row items-center gap-1 px-3 py-1 rounded-full ${
                status?.bg ?? "bg-gray-300"
              }`}
            >
              <Feather name="activity" size={13} color="white" />
              <Text className="text-xs text-white capitalize font-cereal-medium">
                {program.status}
              </Text>
            </View>
          </View>

          {/* Description */}
          <Text
            numberOfLines={3}
            className="mt-3 text-sm leading-relaxed text-gray-600 font-cereal"
          >
            {program.description || "No description available."}
          </Text>

          {/* Divider line */}
          <View className="w-full h-[1px] bg-gray-100 my-4" />

          {/* Footer */}
          <View className="flex-row items-center justify-between">
            {/* Date */}
            <View className="flex-row items-center gap-2">
              <Feather name="calendar" size={16} color="#6B7280" />
              <Text className="text-sm text-gray-700 font-cereal-semibold">
                {program.createdAt
                  ? format(program.createdAt, "dd MMM yyyy")
                  : "Unknown date"}
              </Text>
            </View>

            {/* Total Projects - emphasized */}
            <View className="flex-row items-center gap-2 px-3 py-1.5 rounded-full bg-primary-50 border border-primary-200">
              <Feather name="layers" size={17} color="#1D4ED8" />
              <Text className="text-sm font-cereal-bold text-primary-700">
                {program.Projects?.length || 0} Projects
              </Text>
            </View>
          </View>
        </View>
      </Pressable>
    </View>
  );
}
