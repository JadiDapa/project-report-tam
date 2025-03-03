import { View, Text, Pressable } from "react-native";

export interface HabitCardProps {
  habit: {
    icon: string;
    name: string;
    progress: string;
    target: string;
  };
}

export default function HabitCard({ habit }: HabitCardProps) {
  return (
    <Pressable
      className={`flex-1 p-4 shadow-lg mx-1.5 my-1.5  h-48 justify-between bg-white rounded-xl `}
    >
      <View className="">
        <Text className="text-2xl font-cereal-medium">{habit.icon}</Text>
        <Text className="mt-2 text-xl text font-cereal-medium">
          {habit.name}
        </Text>
        <View className="flex-row gap-2 px-2.5 py-1 self-start rounded-full bg-primary-500/50 mt-2">
          <Text className="text-sm text-white">📅 7 Days</Text>
        </View>
      </View>
      <View className="flex-row items-center justify-between">
        <Text className="text-xl font-cereal-medium">
          {habit.progress} / {habit.target}
        </Text>
        <View className="flex items-center border-2 rounded-full size-6">
          <Text className="text-xl leading-5 font-cereal-medium">+</Text>
        </View>
      </View>
    </Pressable>
  );
}
