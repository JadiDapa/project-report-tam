import { View, Text, Pressable } from "react-native";
import React, { useState } from "react";
import {
  Calendar,
  ChevronDown,
  ChevronUp,
  ClipboardPenLine,
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
    <View className="gap-6 px-6 mt-6 ">
      <View className="gap-3 flex-column">
        <View className="flex-row items-center gap-2">
          <View className="items-center justify-center rounded-full size-8 bg-primary-500">
            <ClipboardPenLine size="16" color="#eeeeee" />
          </View>
          <Text className=" font-cereal-medium">{projectTitle}</Text>
        </View>
        <View className="flex-1 mt-2">
          <Text className="font-cereal">{format(date, "MMM, dd yyyy")}</Text>

          <Text className="text-2xl text-primary-500 font-cereal-medium">
            {reportTitle}
          </Text>
          <View className="flex-row justify-between mt-4">
            <View className="flex-row items-center gap-2">
              <ScanBarcode size="16" color="#4459ff" />
              <Text className="font-cereal-medium">{serialNumber}</Text>
            </View>
            <View className="flex-row items-center gap-2">
              <Text className="font-cereal-medium">{location}</Text>
              <MapPin size="16" color="#4459ff" />
            </View>
          </View>
        </View>
      </View>

      <View className="gap-2">
        <Text className="text-xl font-cereal-bold">Report Detail</Text>
        <Text
          className={`text-base/tight font-cereal text-justify text-slate-600 ${
            moreDetail ? "" : "line-clamp-5"
          }`}
        >
          {description && description}. Lorem ipsum dolor sit amet, consectetur
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
          <Text className="leading-tight font-cereal text-primary-500">
            {moreDetail ? "Show Less" : "Show More"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
