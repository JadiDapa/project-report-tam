import { Tabs } from "expo-router";
import { Text, View } from "react-native";
import { Home, Briefcase, Users, User } from "lucide-react-native"; // Import Lucide icons

export default function TabsLayout() {
  const tabsScreens = [
    {
      name: "index",
      title: "Home",
      Icon: Home,
    },
    {
      name: "project",
      title: "Project",
      Icon: Briefcase,
    },
    {
      name: "employee",
      title: "Employee",
      Icon: Users,
    },
    {
      name: "profile",
      title: "Profile",
      Icon: User,
    },
  ];

  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarStyle: {
          height: 64,
          position: "absolute",
        },
      }}
    >
      {tabsScreens.map((screen) => (
        <Tabs.Screen
          key={screen.name}
          name={screen.name}
          options={{
            title: screen.title,
            headerShown: false,
            tabBarIcon: ({ focused }) => (
              <TabIcon
                focused={focused}
                Icon={screen.Icon} // Pass the Lucide icon component
                title={screen.title}
              />
            ),
          }}
        />
      ))}
    </Tabs>
  );
}

function TabIcon({
  focused,
  Icon,
  title,
}: {
  focused: boolean;
  Icon: any;
  title: string;
}) {
  return (
    <View className="flex flex-col items-center flex-1 mt-3">
      <Icon size={24} color={focused ? "#0061FF" : "#666876"} />
      <Text
        className={`${
          focused
            ? "text-primary-500 font-cereal-medium"
            : "text-black font-cereal"
        } text-xs w-full text-center mt-1`}
      >
        {title}
      </Text>
    </View>
  );
}
