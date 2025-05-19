import { useClerk } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import {
  CreditCard,
  Heart,
  ListChecks,
  Power,
  Settings,
  Tag,
  Tickets,
  Users,
} from "lucide-react-native";
import { View, Text, Pressable } from "react-native";

const menu = [
  {
    title: "Projects",
    Icon: Heart,
    link: "",
  },
  {
    title: "Daily Reports",
    Icon: CreditCard,
    link: "",
  },
  {
    title: "Ticket",
    Icon: Tickets,
    link: "",
  },

  {
    title: "Setting",
    Icon: Settings,
    link: "",
  },
];

export default function ProfileMenu() {
  const { signOut } = useClerk();
  const router = useRouter();

  async function handleSignOut() {
    try {
      await signOut();
      router.replace("/auth");
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <View className="mt-4 bg-white">
      <View className="py-4">
        {menu.map((item) => (
          <Pressable
            key={item.title}
            className="flex-row items-center gap-4 px-6 py-4 "
          >
            <item.Icon size={24} color={"#6073ff"} />
            <Text className="text-lg font-cereal-medium text-primary-700">
              {item.title}
            </Text>
          </Pressable>
        ))}
      </View>
      <Pressable
        onPress={handleSignOut}
        className="flex-row items-center gap-4 px-6 py-6 border-t border-slate-300"
      >
        <Power size={24} color={"#ff6060"} />
        <Text className="text-lg font-cereal-medium text-primary-700">
          Log Out
        </Text>
      </Pressable>
    </View>
  );
}
