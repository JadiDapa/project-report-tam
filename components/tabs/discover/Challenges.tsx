import { habits } from "@/app/(root)/(tabs)";
import {
  View,
  Text,
  Pressable,
  FlatList,
  ProgressBarAndroidBase,
} from "react-native";
import { HabitCardProps } from "../home/HabitCard";
import { LinearGradient } from "expo-linear-gradient";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { Progress, ProgressFilledTrack } from "@/components/ui/progress";

export default function Challenges() {
  return (
    <View className="mt-6 ">
      <View className="flex-row justify-between px-4">
        <Text className="text-lg font-cereal-medium">Challenges</Text>
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
          <ChallengeCard key={habit.name} habit={habit} />
        )}
      />
    </View>
  );
}

export function ChallengeCard({ habit }: HabitCardProps) {
  return (
    <LinearGradient
      colors={["#8288ff", "#000dff"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      className="w-56 h-40 p-4 overflow-hidden bg-white me-3 rounded-2xl"
    >
      <Text className="text-2xl font-cereal-medium">🕑</Text>

      <Text className="mt-1 text-lg text-white font-cereal-medium">
        {habit.name}! {habit.icon}
      </Text>
      <Text className="mt-1 text-white font-cereal">{habit.target} km</Text>
      <View className="w-full mt-2 ">
        <Progress value={40} size="sm" className="h-1" orientation="horizontal">
          <ProgressFilledTrack className="bg-white" />
        </Progress>
      </View>
      <View className="flex flex-row items-center gap-2 mt-2">
        <FontAwesome5 name="users" size={16} color="white" />
        <Text className="text-sm text-white font-cereal">
          5 friends participated
        </Text>
      </View>
    </LinearGradient>
  );
}
