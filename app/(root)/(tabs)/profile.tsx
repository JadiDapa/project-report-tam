import React, { useState } from "react";
import ProfileHeader from "@/components/tabs/profile/ProfileHeader";
import { SafeAreaView, Text } from "react-native";
import FriendList from "@/components/tabs/profile/FriendList";
import Achievements from "@/components/tabs/profile/Achievements";
import ProfileInfo from "@/components/tabs/profile/ProfileInfo";
import ProfileMenu from "@/components/tabs/profile/ProfileMenu";

export const profileMenu = ["general", "friends", "achievements"];

const menuContent: Record<string, JSX.Element> = {
  general: <Text>General</Text>,
  friends: <FriendList />,
  achievements: <Achievements />,
};

export default function profile() {
  const [selectedMenu, setSelectedMenu] = useState("friends");

  function handleSelectMenu(menu: string) {
    setSelectedMenu(menu);
  }

  return (
    <SafeAreaView className="flex-1 bg-primary-50">
      <ProfileHeader />
      <ProfileInfo />
      <ProfileMenu />
    </SafeAreaView>
  );
}
