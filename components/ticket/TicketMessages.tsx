import { View, Text } from "react-native";
import { TicketMessageType } from "@/lib/types/ticket-message";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { socket } from "@/app/(root)/ticket/[id]";
import { useAccount } from "@/contexts/AccountContexts";

interface TicketMessagesProps {
  messages?: TicketMessageType[];
}

export default function TicketMessages({
  messages: initialMessages,
}: TicketMessagesProps) {
  const [messages, setMessages] = useState(initialMessages || []);

  const { account } = useAccount();

  useEffect(() => {
    socket.on("new_message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off("new_message");
    };
  }, []);

  if (!messages) {
    return (
      <View className="items-center justify-center flex-1">
        <Text className="text-slate-400 font-cereal-medium">
          Loading The Messages...
        </Text>
      </View>
    );
  }

  return (
    <View className="relative flex-1 px-6 py-6 mt-3 bg-white">
      {messages?.length > 0 ? (
        <View className="flex">
          {messages.map((message, index) => {
            const prevMessage = messages[index - 1];
            const isSameSender =
              prevMessage && prevMessage.Account.id === message.Account.id;
            const isCurrentUser = message.Account.id === account?.id;

            if (message.type === "status-change") {
              return (
                <View key={message.id}>
                  <Text className="py-4 text-center capitalize text-slate-400 font-cereal-medium">
                    --- {message.content} ---
                  </Text>
                </View>
              );
            }

            if (message.type === "assign-handler") {
              return (
                <View key={message.id}>
                  <Text className="py-4 text-center capitalize text-primary-500 font-cereal-medium">
                    --- {message.content} ---
                  </Text>
                </View>
              );
            }

            return (
              <View
                key={message.id}
                className={`${
                  isSameSender ? "mt-1" : "mt-6"
                } px-4 py-3 rounded-lg w-[90%] ${
                  isCurrentUser
                    ? "bg-primary-500 self-end"
                    : "bg-sky-400 self-start"
                }`}
              >
                {!isSameSender && (
                  <View className="flex-row items-center justify-between gap-2 mb-2">
                    <Text className="text-white font-cereal-medium">
                      {message.Account.fullname}
                    </Text>
                    <Text className="text-sm text-white font-cereal-light">
                      {message.Account.Role.name}
                    </Text>
                  </View>
                )}

                <Text className="text-white font-cereal-regular">
                  {message.content}
                </Text>
                <View className="flex-row justify-end">
                  <Text className="text-sm text-white text-end max-w-fit font-cereal-light">
                    {format(message.createdAt, "HH:mm")}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
      ) : (
        <View>
          <Text className="text-center text-slate-400 font-cereal-medium">
            --- No Messages Found ---
          </Text>
        </View>
      )}
    </View>
  );
}
