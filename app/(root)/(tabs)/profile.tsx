import { SafeAreaView, ScrollView, StatusBar, Text } from "react-native";
import ProfileInfo from "@/components/tabs/profile/ProfileInfo";
import ProfileMenu from "@/components/tabs/profile/ProfileMenu";
import { useAccount } from "@/contexts/AccountContexts";
import TabScreenHeader from "@/components/tabs/TabScreenHeader";

export const profileMenu = ["general", "friends", "achievements"];

export default function profile() {
  const { account, loading } = useAccount();

  if (loading || !account) return <Text>Loading account...</Text>;

  return (
    <SafeAreaView className="flex-1 bg-primary-50">
      <StatusBar backgroundColor="#2d52d2" />
      <TabScreenHeader title="Profile" />
      <>
        <ProfileInfo account={account} />
        <ProfileMenu />
      </>
    </SafeAreaView>
  );
}
