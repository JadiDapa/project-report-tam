import { Text, TouchableOpacity } from "react-native";
import Entypo from "@expo/vector-icons/Entypo";
import { useRouter } from "expo-router";
import { useAccount } from "@/contexts/AccountContexts";

export default function FloatingAction() {
  const router = useRouter();
  const { account, loading } = useAccount();

  if (loading || !account) return <Text>Loading account...</Text>;

  // const isAdmin = account?.role === "admin";
  const isAdmin = true;

  if (!isAdmin) return null;

  return (
    <TouchableOpacity
      onPress={() => router.push("/project/create")}
      activeOpacity={0.9}
      style={{
        position: "absolute",
        zIndex: 999,
        bottom: 80, // Adjust for tab bar height
        right: 16,
        backgroundColor: "#3B82F6", // Primary-500 color
        borderRadius: 999,
        padding: 16,
        alignItems: "center",
        justifyContent: "center",
        elevation: 5, // Android shadow
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
      }}
    >
      <Entypo name="plus" size={24} color="white" />
    </TouchableOpacity>
  );
}
