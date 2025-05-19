import React from "react";
import { Pressable, Text, View } from "react-native";

interface BottomButtonProps {
  onPress: () => void;
  text: string;
}

export default function BottomButton({ text, onPress }: BottomButtonProps) {
  return (
    <View className="absolute bottom-0 w-full px-6 py-4 bg-white border-t shadow-md border-slate-200">
      <Pressable onPress={onPress}>
        <Text className="px-6 py-4 text-lg text-center text-white rounded-md shadow-lg font bg-primary-500 font-cereal-medium shadow-primary-500/50">
          {text}
        </Text>
      </Pressable>
    </View>
  );
}
