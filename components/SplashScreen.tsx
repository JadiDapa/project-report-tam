import { View, Text, SafeAreaView, Image } from "react-native";
import { gradient, circle, logo } from "@/constants/Images";

export default function SplashScreen() {
  return (
    <SafeAreaView className="relative flex items-center justify-center flex-1 bg-primary-500">
      <Image source={gradient} className="absolute -top-12 -left-12 size-96" />
      <Image
        source={gradient}
        className="absolute rotate-180 -bottom-12 -right-12 size-96"
      />
      <Image
        source={circle}
        className="absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 size-96"
      />
      <View className="flex flex-row items-center gap-4 ">
        <Image source={logo} className="size-20 brightness-0 invert" />

        <Text className="text-5xl leading-normal text-white font-cereal-medium">
          DaiHa
        </Text>
      </View>
    </SafeAreaView>
  );
}
