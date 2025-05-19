import { useAccount } from "@/contexts/AccountContexts";
import { AccountType } from "@/lib/types/account";
import { User } from "lucide-react-native";
import { View, Image, Text } from "react-native";

export default function EditAccountForm() {
  const { account, loading } = useAccount();

  if (loading || !account) return <Text>Loading account...</Text>;

  return (
    <View>
      <View>
        <View className="relative overflow-hidden rounded-full size-20">
          <Image
            source={{
              uri:
                account.image ||
                "https://cdn.vectorstock.com/i/500p/08/19/gray-photo-placeholder-icon-design-ui-vector-35850819.jpg",
            }}
            className="object-cover object-center w-full h-full"
          />
        </View>
        <Text className="text-lg font-cereal-medium">{account.fullname}</Text>
        <View className="flex-row gap-2 p-2 rounded-lg bg-primary-200">
          <User size={20} color="blue" />
          <Text>Employee</Text>
        </View>
      </View>
      <AccountInfo account={account} />
    </View>
  );
}

export function AccountInfo({ account }: { account: AccountType }) {
  return (
    <View className="mt-12">
      <View className="py-2">
        <View className="flex-row gap-2 ">
          <User size={20} color="#555" />
          <Text className="text-lg font-cereal-medium">Full Name</Text>
        </View>
        <Text className="font-cereal-medium">{account.fullname}</Text>
      </View>
      <View className="py-2">
        <View className="flex-row gap-2 ">
          <User size={20} color="#555" />
          <Text>Email</Text>
        </View>
        <Text className="font-cereal-medium">{account.email}</Text>
      </View>
    </View>
  );
}
