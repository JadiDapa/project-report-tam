import { View, Text, Image } from "react-native";
import { Mail, Phone, User } from "lucide-react-native";

export default function ProfileInfo() {
  return (
    <View className="pt-6">
      <View className="flex-row items-center gap-4 px-6 mt-4">
        <View className="relative overflow-hidden rounded-full size-20">
          <Image
            source={{
              uri: "https://avatars.githubusercontent.com/u/119063058?v=4",
            }}
            className="object-cover object-center w-full h-full"
          />
        </View>
        <View className="gap-1">
          <Text className="text-2xl font-cereal-medium">Daffa Althaf R</Text>

          <View className="flex-row items-center self-start gap-2 px-3 py-1 rounded-lg bg-primary-100">
            <User size={14} strokeWidth={2} color={"blue"} />
            <Text className="text-sm text-primary-500 font-cereal-medium">
              Employee
            </Text>
          </View>
        </View>
      </View>
      <View className="gap-2 px-6 mt-6">
        <View className="flex-row items-center gap-3 px-3 py-1 rounded-lg">
          <Phone size={16} color={"#555"} />
          <Text className="text-slate-600 font-cereal-medium">
            +62 812 3284 0475
          </Text>
        </View>
        <View className="flex-row items-center gap-3 px-3 py-1 rounded-lg">
          <Mail size={16} color={"#555"} />
          <Text className="text-slate-600 font-cereal-medium">
            daffaalthaf25@gmail.com
          </Text>
        </View>
      </View>
      <View className="flex-row mt-6 ">
        <View className="items-center justify-center flex-1 py-4 border-r border-y border-slate-300">
          <Text className="text-xl font-cereal-medium text-primary-500">
            30
          </Text>
          <Text className="font-cereal-medium">Projects</Text>
        </View>
        <View className="items-center justify-center flex-1 py-3 border-y border-slate-300">
          <Text className="text-xl font-cereal-medium text-primary-500">
            127
          </Text>
          <Text className="font-cereal-medium">Reports</Text>
        </View>
      </View>
    </View>
  );
}
