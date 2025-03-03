import { View, Text, Image } from "react-native";
import React from "react";
import { circle, loginIllust3 } from "@/constants/Images";

export default function SignInHeader() {
  return (
    <View className="relative pt-12">
      <Image source={circle} className="absolute w-full h-full" />

      <View className="relative mx-auto h-52 w-72">
        <Image
          source={loginIllust3}
          className="w-full h-full"
          resizeMode="contain"
        />
      </View>

      <Text className="mt-2 text-3xl text-center text-white font-cereal-medium">
        Hi! Welcome
      </Text>
    </View>
  );
}
