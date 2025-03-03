import { View, Text } from "react-native";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import { LinearGradient } from "expo-linear-gradient";

export default function DailyStatus() {
  return (
    <LinearGradient
      colors={["#000dff", "#8288ff"]} // Gradient from blue to purple
      start={{ x: 0, y: 1 }}
      end={{ x: 0, y: 0 }}
      style={{
        borderRadius: 20,
        padding: 16,
        margin: 16,
        flexDirection: "row",
        gap: 12,
      }}
    >
      <AnimatedCircularProgress
        size={44}
        width={3}
        fill={25}
        tintColor="#ffffff"
        backgroundColor="#c8cfd6"
        rotation={0}
      >
        {(fill) => (
          <Text className="text-white font-cereal">{Math.round(fill)}%</Text>
        )}
      </AnimatedCircularProgress>
      <View>
        <Text className="text-xl text-white font-cereal-medium">
          Keep Up Your Progress! 🔥
        </Text>
        <Text className="text-sm text-white font-cereal-light">
          1 of 4 Completed
        </Text>
      </View>
    </LinearGradient>
  );
}
