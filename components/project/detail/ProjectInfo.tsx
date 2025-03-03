import { Progress, ProgressFilledTrack } from "@/components/ui/progress";
import { View, Text, Pressable } from "react-native";
import React, { useState } from "react";
import { CalendarDaysIcon, Icon } from "@/components/ui/icon";
import { BriefcaseBusiness, ChevronDown, ChevronUp } from "lucide-react-native";
import { format } from "date-fns";

interface ProjectInfoProps {
  title: string;
  description?: string;
  startDate: Date;
  endDate: Date;
}

export default function ProjectInfo({
  title,
  description,
  startDate,
  endDate,
}: ProjectInfoProps) {
  const [moreDetail, setMoreDetail] = useState(false);
  return (
    <View className="gap-6 px-6 mt-6 ">
      <View className="flex flex-row items-center gap-3">
        <View className="items-center justify-center rounded-full size-14 bg-primary-100">
          <Icon as={BriefcaseBusiness} size="xl" color="#4459ff" />
        </View>
        <View>
          <Text className="font-cereal-medium text-primary-500">Project</Text>
          <Text className="text-lg font-cereal-bold">{title}</Text>
        </View>
      </View>

      <View className="flex-row items-center justify-between ">
        <View>
          <Text className="text-lg font-cereal-medium">Start</Text>
          <View className="flex-row items-center gap-2">
            <Icon as={CalendarDaysIcon} size="sm" color="#4459ff" />
            <Text className="font-cereal">
              {format(startDate, "MMM, dd yyyy")}
            </Text>
          </View>
        </View>
        <View>
          <Text className="text-lg font-cereal-medium text-end">Deadline</Text>
          <View className="flex-row items-center gap-2">
            <Icon as={CalendarDaysIcon} size="sm" color="#4459ff" />
            <Text className="font-cereal">
              {format(endDate, "MMM, dd yyyy")}
            </Text>
          </View>
        </View>
      </View>
      <View className="gap-1">
        <View className="flex-row items-center justify-between ">
          <Text className="text-lg font-cereal-medium">In Progress</Text>
          <Text className="text-lg font-cereal-medium">60 %</Text>
        </View>
        <Progress className="w-full bg-primary-100" value={60} size={"sm"}>
          <ProgressFilledTrack />
        </Progress>
      </View>
      <View className="mt-2">
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
