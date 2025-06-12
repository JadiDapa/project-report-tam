import { Progress, ProgressFilledTrack } from "@/components/ui/progress";
import { View, Text, Pressable } from "react-native";
import React, { useState } from "react";
import { Icon } from "@/components/ui/icon";
import {
  CalendarDaysIcon,
  ChevronDown,
  ChevronUp,
  Cog,
  Pencil,
} from "lucide-react-native";
import { router } from "expo-router";
import { useAccount } from "@/contexts/AccountContexts";

interface ProjectInfoProps {
  id: number;
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
}

export default function ProjectInfo({
  id,
  title,
  description,
  startDate,
  endDate,
}: ProjectInfoProps) {
  const [moreDetail, setMoreDetail] = useState(false);
  const { account } = useAccount();

  const isAdmin = account?.Role?.Features?.some((feature) => {
    return feature.name === "Manage Project";
  });

  return (
    <View className="">
      <View className="px-6 py-6 bg-white">
        <View className="flex flex-row items-center justify-center gap-2 ">
          <Cog color="#444" size={24} />
          <Text className="text-lg text-center font-cereal-medium text-slate-700">
            PROJECT
          </Text>
          <Cog color="#444" size={24} />
        </View>

        <Text className="text-xl text-center font-cereal-medium text-primary-500">
          #PR-060525-0001
        </Text>

        <View className="flex flex-row items-center justify-center gap-2 mt-6">
          <Text className="text-lg leading-tight text-center font-cereal-medium">
            {title}
          </Text>
          {isAdmin && (
            <Pressable
              onPress={() =>
                router.push({
                  pathname: "/project/update/[id]",
                  params: { id: id },
                })
              }
            >
              <Pencil size={14} color={"#4459ff"} />
            </Pressable>
          )}
        </View>
      </View>

      <View className="px-6 py-6 mt-4 bg-white ">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-lg font-cereal-medium">Start</Text>
            <View className="flex-row items-center gap-2">
              <Icon as={CalendarDaysIcon} size="sm" color="#4459ff" />
              <Text className="font-cereal">{startDate}</Text>
            </View>
          </View>
          <View>
            <Text className="text-lg font-cereal-medium text-end">
              Deadline
            </Text>
            <View className="flex-row items-center gap-2">
              <Icon as={CalendarDaysIcon} size="sm" color="#4459ff" />
              <Text className="font-cereal">{endDate}</Text>
            </View>
          </View>
        </View>
        <View className="gap-1 mt-9">
          <View className="flex-row items-center justify-between ">
            <Text className="text-lg font-cereal-medium">In Progress</Text>
            <Text className="text-lg font-cereal-medium">60 %</Text>
          </View>
          <Progress className="w-full bg-primary-100" value={60} size={"sm"}>
            <ProgressFilledTrack />
          </Progress>
        </View>
      </View>

      <View className="px-6 py-6 mt-4 bg-white ">
        <Text className="text-xl font-cereal-bold">Overview</Text>
        <Text
          className={`font-cereal text-justify text-slate-600 ${
            moreDetail ? "" : "line-clamp-5"
          }`}
        >
          {description && description}The project will incoperate with several
          web development technologies. Lorem ipsum dolor sit amet, consectetur
          adipisicing elit. Nesciunt, ducimus? Repudiandae ab error consequatur
          nisi saepe reprehenderit maiores! Eum sed pariatur libero, repudiandae
          dolore quasi praesentium, earum porro assumenda totam animi eaque
          maiores impedit expedita officiis accusantium perferendis.{" "}
        </Text>
        <Pressable
          className="flex-row items-center self-end gap-2"
          onPress={() => setMoreDetail(!moreDetail)}
        >
          <Icon
            as={moreDetail ? ChevronUp : ChevronDown}
            size="lg"
            color="#4459ff"
          />
          <Text className="eading-tight font-cereal text-primary-500">
            {moreDetail ? "Show Less" : "Show More"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
