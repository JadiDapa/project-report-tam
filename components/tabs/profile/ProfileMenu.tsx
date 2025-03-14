import {
  CreditCard,
  Heart,
  Power,
  Settings,
  Tag,
  Users,
} from "lucide-react-native";
import { View, Text, Pressable } from "react-native";

const menu = [
  {
    title: "Your Favorites",
    Icon: Heart,
    link: "",
  },
  {
    title: "Payment",
    Icon: CreditCard,
    link: "",
  },
  {
    title: "Friends",
    Icon: Users,
    link: "",
  },
  {
    title: "Promotions",
    Icon: Tag,
    link: "",
  },
  {
    title: "Setting",
    Icon: Settings,
    link: "",
  },
];

export default function ProfileMenu() {
  return (
    <View className="">
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
      <Pressable className="flex-row items-center gap-4 px-6 py-6 border-t border-slate-300">
        <Power size={24} color={"#ff6060"} />
        <Text className="text-lg font-cereal-medium text-primary-700">
          Log Out
        </Text>
      </Pressable>
    </View>
  );
}
