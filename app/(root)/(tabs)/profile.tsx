import ProfileHeader from "@/components/tabs/profile/ProfileHeader";
import { SafeAreaView, Text } from "react-native";
import ProfileInfo from "@/components/tabs/profile/ProfileInfo";
import ProfileMenu from "@/components/tabs/profile/ProfileMenu";
import { getAccountByEmail } from "@/lib/network/account";
import { useUser } from "@clerk/clerk-expo";
import { useQuery } from "@tanstack/react-query";
import Loading from "@/components/LoadingScreen";

export const profileMenu = ["general", "friends", "achievements"];

export default function profile() {
  const { user } = useUser();

  const userEmail = user?.primaryEmailAddress?.emailAddress || "";

  const { data: account } = useQuery({
    queryFn: () => getAccountByEmail(userEmail),
    queryKey: ["accounts", userEmail],
  });

  if (!account) return <Loading />;

  return (
    <SafeAreaView className="flex-1 pt-8 bg-primary-50">
      <ProfileHeader />
      <ProfileInfo account={account} />
      <ProfileMenu />
    </SafeAreaView>
  );
}
