import { habits } from "@/app/(root)/(tabs)";
import { View, Text, Pressable, FlatList } from "react-native";
import { HabitCardProps } from "../home/HabitCard";

export default function SuggestedHabits() {
  return (
    <View className="mt-6 ">
      <View className="flex-row justify-between px-4">
        <Text className="text-lg font-cereal-medium">Suggested For You</Text>
        <Pressable>
          <Text className="text-primary-500 font-cereal-medium">VIEW ALL</Text>
        </Pressable>
      </View>

      <FlatList
        data={[...habits].reverse()} // Avoid mutating the original array
        horizontal
        className="mt-2 ps-4"
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.name}
        renderItem={({ item: habit }) => <SuggestedHabitCard habit={habit} />}
      />
    </View>
  );
}

export function SuggestedHabitCard({ habit }: HabitCardProps) {
  const getRandomPastelColor = () => {
    const hue = Math.floor(Math.random() * 360);
    const pastelColor = `hsl(${hue}, 70%, 85%)`;
    return pastelColor;
  };

  return (
    <Pressable
      onPress={() => {}}
      style={{ backgroundColor: getRandomPastelColor() }}
      className="h-32 p-4 me-3 w-36 rounded-xl"
    >
      <View className="items-center justify-center w-10 h-10 bg-white rounded-xl">
        <Text className="text-2xl font-cereal-medium">{habit.icon}</Text>
      </View>

      <Text className="mt-2 text font-cereal-medium">{habit.name}</Text>
      <Text className="mt-2 text font-cereal">{habit.target} km</Text>
    </Pressable>
  );
}
