import { View, Text } from "react-native";
import Feather from "@expo/vector-icons/Feather";

const menuShortcutList = [
  {
    name: "Projects",
    icon: "list",
    route: "/projects",
  },
  {
    name: "Coming S1",
    icon: "users",
    route: "/comingS1",
  },
  {
    name: "Coming S2",
    icon: "clipboard",
    route: "/comingS2",
  },
  {
    name: "Coming S3",
    icon: "activity",
    route: "/comingS3",
  },
];

export default function MenuShortcut() {
  return (
    <View className="flex flex-row justify-between px-6 mt-6">
      {menuShortcutList.map((menu, index) => (
        <View key={index} className="flex items-center gap-1 ">
          <View className="flex items-center justify-center p-2 border border-slate-500 rounded-2xl size-14">
            <Feather name={menu.icon} size={24} color="#57595f" />
          </View>

          <Text className="text-sm font-cereal-medium">{menu.name}</Text>
        </View>
      ))}
    </View>
  );
}
