import { useState } from "react";
import { View, Text, Pressable, TouchableOpacity } from "react-native";
import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
} from "@/components/ui/actionsheet";
import { Pencil } from "lucide-react-native";

interface Option {
  label: string;
  value: string | number;
}

interface SelectTicketExecutorProps {
  value?: string | number;
  onChange: (value: string | number) => void;
  options: Option[];
  placeholder?: string;
  label?: string;
}

export default function SelectTicketExecutor({
  value,
  onChange,
  options,
  placeholder = "Select an option",
  label = "Select Option",
}: SelectTicketExecutorProps) {
  const [showActionsheet, setShowActionsheet] = useState(false);

  return (
    <Pressable
      className="flex flex-col justify-end"
      onPress={() => setShowActionsheet(true)}
    >
      {value ? (
        <View className="flex flex-row items-center gap-2">
          <Pencil size={12} color={"blue"} />

          <Text className="text-black text-end">
            {options.find((o) => o.value === value)?.label}
          </Text>
        </View>
      ) : (
        <View className="rounded-md bg-primary-500 px-2 py-0.5 mt-1">
          <Text className="text-white">{placeholder}</Text>
        </View>
      )}

      <Actionsheet
        isOpen={showActionsheet}
        onClose={() => setShowActionsheet(false)}
      >
        <ActionsheetBackdrop />
        <ActionsheetContent>
          <ActionsheetDragIndicatorWrapper>
            <ActionsheetDragIndicator />
          </ActionsheetDragIndicatorWrapper>
          <View className="relative flex-col items-center justify-center w-full gap-2 mt-4">
            <Text className="text-lg font-cereal-medium">{label}</Text>
            <View className="w-full">
              {options.map((option, i) => (
                <TouchableOpacity
                  key={i}
                  onPress={() => {
                    onChange(option.value);
                    setShowActionsheet(false);
                  }}
                  className={`w-full py-4 ${
                    i !== 0 && "border-t"
                  } border-slate-200`}
                >
                  <Text className="text-center font-cereal-regular">
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ActionsheetContent>
      </Actionsheet>
    </Pressable>
  );
}
