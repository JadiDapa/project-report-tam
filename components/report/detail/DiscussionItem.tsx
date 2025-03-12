import { Image, Text, View } from "react-native";
import { format } from "date-fns";

interface DiscussionItemProps {
  image: string;
  content: string;
  fullname: string;
  createdAt: Date;
}

export default function DiscussionItem({
  image,
  content,
  fullname,
  createdAt,
}: DiscussionItemProps) {
  return (
    <View className="flex-row gap-4 px-6 py-4">
      <View className="overflow-hidden rounded-full size-12">
        <Image
          source={{ uri: image }}
          resizeMode="cover"
          className="object-center w-full h-full"
        />
      </View>
      <View className="flex-wrap gap-1">
        <View className="flex-row flex-wrap gap-4">
          <Text className="flex-wrap text-primary font-cereal-medium">
            {fullname}
          </Text>
          <Text className="flex-wrap font-cereal">
            {format(createdAt, "dd/MM/yyyy")} - {format(createdAt, "HH:mm")}
          </Text>
        </View>
        <Text className="flex-wrap font-cereal">{content}</Text>
      </View>
    </View>
  );
}
