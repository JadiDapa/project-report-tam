import { useEffect, useRef, useState } from "react";
import { Animated, TextInput, View } from "react-native";

interface FloatingInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  multiline?: boolean;
  numberOfLines?: number;
}

export default function FloatingInput({
  label,
  value,
  onChangeText,
  multiline = false,
  numberOfLines = 4,
}: FloatingInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const animatedIsFocused = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedIsFocused, {
      toValue: isFocused || value ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [isFocused, value]);

  const labelStyle = {
    position: "absolute" as const,
    left: 12,
    backgroundColor: "white",
    paddingHorizontal: 4,
    transform: [
      {
        translateY: animatedIsFocused.interpolate({
          inputRange: [0, 1],
          outputRange: [16, -10],
        }),
      },
    ],
    fontSize: animatedIsFocused.interpolate({
      inputRange: [0, 1],
      outputRange: [14, 12],
    }),
    color: animatedIsFocused.interpolate({
      inputRange: [0, 1],
      outputRange: ["#9ca3af", "#9ca3af"],
    }),
  };

  return (
    <View
      className={`${
        isFocused ? "border-primary-300" : "border-gray-300"
      } relative w-full border rounded-md pt-1`}
      style={{ minHeight: multiline ? numberOfLines * 24 + 32 : undefined }}
    >
      <Animated.Text className="font-cereal-regular" style={labelStyle}>
        {label}
      </Animated.Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        multiline={multiline}
        numberOfLines={numberOfLines}
        className="px-5 py-4 text-base text-black"
        style={{ textAlignVertical: multiline ? "top" : "center" }}
      />
    </View>
  );
}
