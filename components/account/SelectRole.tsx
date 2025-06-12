import { useState } from "react";
import {
  View,
  Text,
  Pressable,
  TouchableHighlight,
  TouchableOpacity,
} from "react-native";
import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
  ActionsheetItem,
  ActionsheetItemText,
} from "@/components/ui/actionsheet";
import { Image, Plus, X } from "lucide-react-native";
import { useQuery } from "@tanstack/react-query";
import { getAllRoles } from "@/lib/network/role";
import { router } from "expo-router";

interface SelectRoleProps {
  value?: string;
  onChange: (value: string) => void;
}

export default function SelectRole({ value, onChange }: SelectRoleProps) {
  const [showActionsheet, setShowActionsheet] = useState(false);
  const { data: roles } = useQuery({
    queryFn: () => getAllRoles(),
    queryKey: ["roles"],
  });

  return (
    <Pressable onPress={() => setShowActionsheet(true)}>
      <View className="relative w-full px-5 py-5 border border-gray-300 rounded-md">
        <Text
          className={`${value ? "" : "text-slate-400"} font-cereal-regular `}
        >
          {value || "Select Role"}
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
            <Text className="text-lg font-cereal-medium">
              Select Account Role
            </Text>
            <View className="w-full">
              {roles?.map((role, i) => (
                <TouchableOpacity
                  key={i}
                  onPress={() => onChange(role.name)}
                  className={`w-full py-4 ${
                    i !== 0 && "border-t"
                  }  border-slate-200`}
                >
                  <Text className="text-center font-cereal-regular">
                    {role.name}
                  </Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity
                onPress={() =>
                  router.push({
                    pathname: "/role/create",
                  })
                }
                className={`w-full gap-2 flex flex-row justify-center py-4 border border-dashed border-slate-300 rounded-md`}
              >
                <Text className="text-center font-cereal-medium">
                  Add New Role
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
