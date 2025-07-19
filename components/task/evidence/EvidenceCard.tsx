import { View, Text, Pressable, Image } from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import { format } from "date-fns";
import { TaskEvidenceType } from "@/lib/types/task-evidence";

export default function EvidenceCard({
  evidence,
}: {
  evidence: TaskEvidenceType;
}) {
  const router = useRouter();

  const isEvidenceAvailable = evidence.TaskEvidenceImages.length > 0;

  return (
    <View className="px-6 bg-white pb-7">
      <Pressable
        onPress={() =>
          router.push({
            pathname: `/task/evidence/[id]`,
            params: { id: evidence.id },
          })
        }
        className="flex-row items-center w-full gap-3 p-4 bg-white border shadow-md border-primary-100 rounded-xl"
      >
        <View className="justify-between flex-1 h-full">
          <View className="flex-col justify-between flex-1 ">
            <Text className="capitalize text-primary-500 font-cereal-medium line-clamp-2">
              {evidence.title}
            </Text>
            {isEvidenceAvailable ? (
              <Text className="mt-5 text-sm font-cereal-regular line-clamp-2">
                {evidence.description || "No Description Provided"}
              </Text>
            ) : (
              <View>
                <Text className="text-xs text-red-400 font-cereal-bold">
                  No Report Yet
                </Text>
                <Text className="mt-1 text-xs font-cereal-regular">
                  (Click to Upload Evidence)
                </Text>
              </View>
            )}

            {isEvidenceAvailable && (
              <View className="flex-row items-center justify-between">
                <Text className="text-xs text-slate-500 font-cereal-regular">
                  {format(evidence.createdAt, "MMM dd, yyyy")}
                </Text>
              </View>
            )}
          </View>
        </View>
        <View className="relative overflow-hidden border-2 rounded-md size-20 border-primary-100">
          <Image
            source={{
              uri: isEvidenceAvailable
                ? evidence.TaskEvidenceImages[0].image
                : "https://static.vecteezy.com/system/resources/thumbnails/016/808/173/small_2x/camera-not-allowed-no-photography-image-not-available-concept-icon-in-line-style-design-isolated-on-white-background-editable-stroke-vector.jpg",
            }}
            className="object-cover object-center w-full h-full"
          />
        </View>
      </Pressable>
    </View>
  );
}
