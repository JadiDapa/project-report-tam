import { View, Text, Pressable } from "react-native";
import React, { Dispatch } from "react";

interface EmployeeMenuSelect {
  selectedMenu: string;
  setSelectedMenu: Dispatch<React.SetStateAction<string>>;
}

export default function EmployeeMenuSelect({
  selectedMenu,
  setSelectedMenu,
}: EmployeeMenuSelect) {
  const menu = [{ name: "projects" }, { name: "reports" }];
  return (
    <View className="flex-row items-center w-full h-10 gap-4 px-4 border-b-2 border-slate-300">
      {menu.map((m) => (
        <Pressable
          key={m.name}
          onPress={() => setSelectedMenu(m.name)}
          className={`justify-center flex-1 h-full border-b-4  ${
            selectedMenu === m.name
              ? "border-primary-500"
              : "border-transparent"
          }`}
        >
          <Text
            className={`text-center capitalize ${
              selectedMenu === m.name
                ? "font-cereal-bold text-primary-500"
                : "font-cereal-medium text-slate-500"
            }`}
          >
            {m.name}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}
