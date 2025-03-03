import { habits } from "@/app/(root)/(tabs)";
import { View, Text, Pressable, FlatList, Image } from "react-native";
import { HabitCardProps } from "../home/HabitCard";
import { LinearGradient } from "expo-linear-gradient";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";

export default function Learning() {
  return (
    <View className="mt-6 ">
      <View className="flex-row justify-between px-4">
        <Text className="text-lg font-cereal-medium">Learning</Text>
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
          <LearningCard key={habit.name} habit={habit} />
        )}
      />
    </View>
  );
}

export function LearningCard({ habit }: HabitCardProps) {
  return (
    <View className="relative w-56 overflow-hidden h-44 rounded-2xl me-3">
      <Image
        className="w-full h-full"
        source={{
          uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRs39e73IHIw06cKujmTObbOPYex2kCgmlqWg&s",
        }}
      />
      <LinearGradient
        colors={["#8288ff", "#000dff"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="absolute bottom-0 left-0 flex flex-row w-full gap-2 p-3"
      >
        <View className="mt-1">
          <FontAwesome5 name="newspaper" size={18} color="white" />
        </View>

        <Text className="text-white flex-1text-lg font-cereal">
          Why Do You Need Drink Water?
        </Text>
      </LinearGradient>
    </View>
  );
}
