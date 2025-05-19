import { View, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";

export default function AuthActions() {
  const router = useRouter();
  return (
    <View>
      <Pressable
        onPress={() => router.push("/sign-in")}
        className="p-4 mt-6 overflow-hidden bg-white rounded-full"
      >
        <Text className="text-lg text-center text-primary-500 font-cereal-medium">
          Login With Your Account
        </Text>
      </Pressable>
      <Pressable
        onPress={() => router.push("/sign-up")}
        className="p-4 mt-2 overflow-hidden border border-white rounded-full"
      >
        <Text className="text-lg text-center text-white font-cereal-medium">
          Request New Account
        </Text>
      </Pressable>
      <Text className="mt-4 text-xs text-center text-white/50 font-cereal">
        By continuing you agree Terms of Services & Privacy Policy
      </Text>
    </View>
  );
}
