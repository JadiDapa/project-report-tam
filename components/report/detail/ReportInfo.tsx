import { View, Text, Pressable } from "react-native";
import React, { useState } from "react";
import {
  Calendar,
  CalendarDaysIcon,
  ChevronDown,
  ChevronUp,
  ClipboardPenLine,
  Cog,
  MapPin,
  ScanBarcode,
} from "lucide-react-native";
import { Icon } from "@/components/ui/icon";
import { format } from "date-fns";

interface ReportInfoProps {
  projectTitle: string;
  reportTitle: string;
  serialNumber: string;
  location: string;
  date: Date;
  description?: string;
}

export default function ReportInfo({
  projectTitle,
  reportTitle,
  serialNumber,
  location,
  date,
  description,
}: ReportInfoProps) {
  const [moreDetail, setMoreDetail] = useState(false);

  return (
    <View className="">
      <View className="px-6 py-6 bg-white">
        <View className="flex flex-row items-center justify-center gap-2 ">
          <Cog color="#444" size={24} />
          <Text className="text-lg text-center font-cereal-medium text-slate-700">
            PROJECT REPORT
          </Text>
          <Cog color="#444" size={24} />
        </View>

        <Text className="text-xl text-center font-cereal-medium text-primary-500">
          #PR-060525-0001
        </Text>

        <Text className="mt-4 text-lg leading-tight text-center font-cereal-medium">
          {reportTitle}
        </Text>
        <Text className="mt-2 text-center text-primary-300 font-cereal-regular">
          {format(date, "dd MMMM yyyy, HH:mm")}
        </Text>
      </View>

      <View className="px-6 py-6 mt-4 bg-white ">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-lg font-cereal-medium">Serial Number</Text>
            <View className="flex-row items-center gap-2">
              <Icon as={CalendarDaysIcon} size="sm" color="#4459ff" />
              <Text className="font-cereal">{serialNumber}</Text>
            </View>
          </View>
          <View>
            <Text className="text-lg font-cereal-medium text-end">
              Location
            </Text>
            <View className="flex-row items-center gap-2">
              <Icon as={CalendarDaysIcon} size="sm" color="#4459ff" />
              <Text className="font-cereal">{location}</Text>
            </View>
          </View>
        </View>
      </View>

      <View className="px-6 py-6 mt-4 bg-white ">
        <Text className="text-xl font-cereal-bold">Detail</Text>
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
