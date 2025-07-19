import { View, Text, FlatList, Pressable, Image } from "react-native";
import React from "react";
import { ProjectAssignmentType } from "@/lib/types/project-assignment";
import { getInitials } from "@/lib/getInitials";
import { Plus } from "lucide-react-native";

interface ProjectEmployees {
  employees: ProjectAssignmentType[];
  isModifiable?: boolean;
}

export default function ProjectEmployees({
  employees,
  isModifiable = true,
}: ProjectEmployees) {
  return (
    <View className="gap-3 py-6 mt-4 bg-white">
      <View className="flex-row items-center gap-2 px-6">
        <Text className="text-xl font-cereal-bold">Employees</Text>
        <Text className="text-lg text-primary-500 font-cereal-medium">
          ({employees.length})
        </Text>
      </View>
      <FlatList
        data={employees}
        horizontal
        className="ps-6"
        showsHorizontalScrollIndicator={false}
        ListFooterComponent={() => {
          if (isModifiable)
            return (
              <View className="items-center mx-2">
                <Pressable
                  onPress={() => {}}
                  className="items-center justify-center border-2 border-dashed rounded-full border-slate-700 size-14"
                >
                  <Plus size={28} color="#46474a" />
                </Pressable>
                <Text className="mt-1 text-xs text-center capitalize font-cereal-medium">
                  Add
                </Text>
              </View>
            );
        }}
        keyExtractor={(employee) => employee.id.toString()}
        renderItem={({ item: employee }) => (
          <View className="items-center w-16 me-1 rounded-xl">
            <View className="relative items-center justify-center overflow-hidden rounded-full bg-primary-300 size-14">
              {employee.Account.image ? (
                <Image
                  src={employee.Account.image}
                  className="w-full h-full "
                  resizeMode="cover"
                />
              ) : (
                <Text className="text-xl text-white font-cereal-medium">
                  {getInitials(employee.Account.fullname)}
                </Text>
              )}
            </View>
            <Text className="mt-1 text-xs text-center capitalize">
              {employee.Account.fullname}
            </Text>
          </View>
        )}
      />
    </View>
  );
}
