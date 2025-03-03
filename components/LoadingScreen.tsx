import { View, Text } from "react-native";

export default function Loading() {
  return (
    <View className="items-center justify-center flex-1 bg-transparent">
      <Text className="text-4xl text-center font-cereal-light text-primary-500">
        ... Loading ...
      </Text>
    </View>
  );
}
