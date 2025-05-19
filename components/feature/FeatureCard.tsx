import { View, Text, Pressable } from "react-native";
import React from "react";
import { router } from "expo-router";
import { LucideIcon } from "lucide-react-native";

interface FeatureProps {
  feature: {
    name: string;
    icon: LucideIcon;
    category: string;
    route: string;
    requiredFeature?: string;
  };
}

export default function FeatureCard({ feature }: FeatureProps) {
  return (
    <View className="px-6">
      <Pressable
        onPress={() => router.push(feature.route as any)}
        className="flex flex-row items-center w-full gap-4 py-4 bg-white border-b border-slate-100 rounded-xl"
      >
        <View className="items-center justify-center overflow-hidden rounded-lg bg-primary-100 size-12">
          <feature.icon size={20} color="#093adc" />
        </View>
        <View className="flex-1">
          <View className="">
            {feature.category && (
              <Text className="text-sm font-cereal-regular text-primary-500">
                {feature.category}
              </Text>
            )}
            <Text className="text-lg capitalize font-cereal-medium">
              {feature.name}
            </Text>
          </View>
        </View>
      </Pressable>
    </View>
  );
}
