import { habits } from "@/app/(root)/(tabs)";
import { View, Text, Pressable, FlatList } from "react-native";
import { HabitCardProps } from "../home/HabitCard";

export default function HabitClubs() {
  return (
    <View className="mt-6 ">
      <View className="flex-row justify-between px-4">
        <Text className="text-lg font-cereal-medium">Habit Clubs</Text>
        <Pressable>
          <Text className="text-primary-500 font-cereal-medium">VIEW ALL</Text>
        </Pressable>
      </View>

      <FlatList
        data={habits}
        horizontal
        className="mt-2 ps-4"
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.name}
        renderItem={({ item: habit }) => (
          <ClubCard key={habit.name} habit={habit} />
        )}
      />
    </View>
  );
}

export function ClubCard({ habit }: HabitCardProps) {
  return (
    <Pressable
      onPress={() => {}}
      className="h-32 p-4 bg-white me-3 w-36 rounded-xl"
    >
      <View className="items-center justify-center w-10 h-10 bg-white rounded-xl">
        <Text className="text-2xl font-cereal-medium">{habit.icon}</Text>
      </View>

      <Text className="mt-2 text font-cereal-medium">{habit.name}</Text>
      <Text className="mt-2 text font-cereal">{habit.target} km</Text>
    </Pressable>
  );
}
