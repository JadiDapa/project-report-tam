import { Dispatch, useState } from "react";
import { Text, Pressable, FlatList } from "react-native";

const roles = [
  { label: "All", value: "all" },
  { label: "Admin", value: "admin" },
  { label: "Employee", value: "employee" },
];

interface StatusSelectProps {
  selectedRole: string;
  setSelectedRole: Dispatch<React.SetStateAction<string>>;
}

export default function EmployeeRoleSelect({
  selectedRole,
  setSelectedRole,
}: StatusSelectProps) {
  return (
    <FlatList
      data={roles}
      horizontal
      className="mt-2 ps-6"
      showsHorizontalScrollIndicator={false}
      keyExtractor={(status) => status.label.toString()}
      renderItem={({ item }) => (
        <Pressable
          onPress={() => setSelectedRole(item.value)}
          className={`items-center justify-center border  me-2  h-8 px-4 py-1 mt-3 w-28 rounded-full ${
            selectedRole === item.value
              ? "bg-primary-500 border-primary-500"
              : "border-slate-500"
          }`}
        >
          <Text
            className={`font-cereal-medium ${
              selectedRole === item.value ? "text-white" : "text-slate-500"
            }`}
          >
            {item.label}
          </Text>
        </Pressable>
      )}
    />
  );
}
