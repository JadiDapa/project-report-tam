import {
  View,
  Text,
  Pressable,
  Animated,
  Platform,
  UIManager,
} from "react-native";
import { useRef, useState } from "react";
import { useRouter } from "expo-router";
import {
  ChevronDown,
  ChevronUp,
  ClipboardEdit,
  ClipboardList,
  List,
  ListCheck,
  Ticket,
  TicketCheck,
  Tickets,
  Users,
} from "lucide-react-native";
import { useAccount } from "@/contexts/AccountContexts";
import { AccountType } from "@/lib/types/account";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const ITEM_HEIGHT = 100;

export default function MenuShortcut() {
  const [isExpand, setIsExpand] = useState(false);
  const animatedHeight = useRef(new Animated.Value(ITEM_HEIGHT)).current;

  const router = useRouter();

  const { account } = useAccount();

  function hasFeature(
    account: AccountType | null | undefined,
    featureName: string
  ): boolean {
    return !!account?.Role?.Features?.some(
      (feature) => feature.name === featureName
    );
  }

  const menuShortcutList = [
    {
      name: "All Projects",
      icon: ListCheck,
      route: `/project`,
      requiredFeature: "Manage Project",
    },
    {
      name: "All Daily Reports",
      icon: ClipboardList,
      route: `/daily-report`,
      requiredFeature: "Manage Daily Report",
    },
    {
      name: "Manage Tickets",
      icon: Tickets,
      route: `/ticket`,
      requiredFeature: "Manage Ticket",
    },
    {
      name: "Assigned Ticket",
      icon: TicketCheck,
      route: `/ticket/handler/${account?.id}`,
      requiredFeature: "Handle Ticket",
    },
    {
      name: "My Projects",
      icon: List,
      route: `/project/account/${account?.id}`,
    },
    {
      name: "My Daily Reports",
      icon: ClipboardEdit,
      route: `/daily-report/account/${account?.id}`,
    },
    {
      name: "My Tickets",
      icon: Ticket,
      route: `/ticket/requester/${account?.id}`,
    },
    {
      name: "Employee List",
      icon: Users,
      route: "/account",
    },
  ];

  const visibleMenuItems = menuShortcutList.filter((item) => {
    return !item.requiredFeature || hasFeature(account, item.requiredFeature);
  });

  const toggleExpand = () => {
    const toValue = isExpand
      ? ITEM_HEIGHT
      : ITEM_HEIGHT * Math.ceil(menuShortcutList.length / 4);
    Animated.timing(animatedHeight, {
      toValue,
      duration: 300,
      useNativeDriver: false,
    }).start();
    setIsExpand(!isExpand);
  };

  return (
    <View className="px-6 pt-6 bg-white">
      <Animated.View style={{ height: animatedHeight, overflow: "hidden" }}>
        <View className="flex flex-row flex-wrap gap-2 gap-y-4">
          {visibleMenuItems.map((menu, index) => (
            <Pressable
              onPress={() =>
                router.push({
                  pathname:
                    menu.route as (typeof router.push.arguments)[0]["pathname"],
                })
              }
              key={index}
              className="flex items-center w-[23%] gap-1 px-2"
            >
              <View className="flex items-center justify-center p-2 border border-slate-500 rounded-2xl size-14">
                <menu.icon size={24} color="#3f4043" />
              </View>
              <Text className="text-sm text-center font-cereal-medium">
                {menu.name}
              </Text>
            </Pressable>
          ))}
        </View>
      </Animated.View>

      <Pressable
        onPress={toggleExpand}
        className="flex flex-row justify-center gap-1 py-4 border-t border-slate-300"
      >
        <Text className="text-center font-cereal-medium text-primary-500">
          {isExpand ? "Show Less" : "Show More"}
        </Text>
        {isExpand ? (
          <ChevronUp size={20} color="#2d52d2" />
        ) : (
          <ChevronDown size={20} color="#2d52d2" />
        )}
      </Pressable>
    </View>
  );
}
