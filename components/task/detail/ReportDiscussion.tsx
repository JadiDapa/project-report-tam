import { View, Text, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import { MessageSquareText } from "lucide-react-native";
import DiscussionItem from "./DiscussionItem";
import DiscussionInput from "./DiscussionInput";
import { useQuery } from "@tanstack/react-query";
import { getReportDiscussionsByReportId } from "@/lib/network/report-discussion";
import { useAuth } from "@clerk/clerk-expo";
import { io } from "socket.io-client";
import { ReportDiscussionType } from "@/lib/types/report-discussion";

interface ReportDiscussionProps {
  reportId: number;
  accountId: number;
}

const socket = io(process.env.EXPO_PUBLIC_BASE_API_URL_SOCKET, {
  autoConnect: false,
});

export default function ReportDiscussion({
  reportId,
  accountId,
}: ReportDiscussionProps) {
  const { getToken } = useAuth();
  const [discussionList, setDiscussionList] = useState<ReportDiscussionType[]>(
    []
  );

  const { data: discussions } = useQuery<ReportDiscussionType[], Error>({
    queryKey: ["discussions", reportId],
    queryFn: async () => {
      return getReportDiscussionsByReportId(reportId.toString(), getToken);
    },
  });

  // Ensure discussionList updates only when query discussions changes
  useEffect(() => {
    if (discussions) {
      setDiscussionList(discussions);
    }
  }, [discussions]);

  useEffect(() => {
    socket.connect(); // Ensure socket connection starts properly

    const handleNewDiscussion = (newDiscussion: ReportDiscussionType) => {
      setDiscussionList((prev) => {
        const exists = prev.some((d) => d.id === newDiscussion.id);
        return exists ? prev : [...prev, newDiscussion]; // Prevent duplicate additions
      });
    };

    socket.on("discussion", handleNewDiscussion);

    return () => {
      socket.off("discussion", handleNewDiscussion);
      socket.disconnect(); // Cleanup socket connection when component unmounts
    };
  }, []);

  return (
    <View className="mt-4">
      <FlatList
        data={discussionList}
        className="min-h-screen"
        keyExtractor={(discussion) => discussion.id.toString()}
        ListHeaderComponent={() => <DiscussionHeader />}
        renderItem={({ item: discussion }) => (
          <DiscussionItem
            image={"https://picsum.photos/200/300"}
            content={discussion.content}
            fullname={discussion.Account.fullname}
            createdAt={discussion.createdAt}
          />
        )}
        ListFooterComponent={() => (
          <DiscussionInput reportId={reportId} accountId={accountId} />
        )}
      />
    </View>
  );
}

function DiscussionHeader() {
  return (
    <View className="mb-4">
      <View className="w-full h-1 bg-slate-300" />
      <View className="flex-row items-center gap-4 px-6 py-2">
        <MessageSquareText size={24} color={"#57595f"} />
        <Text className="text-lg font-cereal-medium">Discussion</Text>
      </View>
      <View className="w-full h-[1px] bg-slate-300" />
    </View>
  );
}
