import { useState } from "react";
import { View, Text, Pressable, TouchableOpacity } from "react-native";
import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
} from "@/components/ui/actionsheet";

interface Option {
  label: string;
  value: string | number;
}

interface SelectSingleInputProps {
  value?: string | number;
  onChange: (value: string | number) => void;
  options: Option[];
  placeholder?: string;
  label?: string;
}

export default function SelectSingleInput({
  value,
  onChange,
  options,
  placeholder = "Select an option",
  label = "Select Option",
}: SelectSingleInputProps) {
  const [showActionsheet, setShowActionsheet] = useState(false);

  return (
    <Pressable onPress={() => setShowActionsheet(true)}>
      <View className="relative w-full px-5 py-5 border border-gray-300 rounded-md">
        <Text
          className={`${value ? "" : "text-slate-400"} font-cereal-regular`}
        >
          {value || placeholder}
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
