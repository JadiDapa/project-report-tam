import { View, Pressable } from "react-native";
import React, { useState } from "react";
import { Plus, Send } from "lucide-react-native";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Textarea, TextareaInput } from "@/components/ui/textarea";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createReportDiscussion } from "@/lib/network/report-discussion";
import { useAuth } from "@clerk/clerk-expo";
import { CreateReportDiscussionType } from "@/lib/types/report-discussion";
import { io } from "socket.io-client";

const discussionSchema = z.object({
  content: z.string().min(3, "Title must be at least 3 characters"),
});

interface DiscussionInputProps {
  reportId: number;
  accountId: number;
}

const socket = io(process.env.EXPO_PUBLIC_BASE_API_URL_SOCKET);

export default function DiscussionInput({
  reportId,
  accountId,
}: DiscussionInputProps) {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  const { control, handleSubmit, reset } = useForm<
    z.infer<typeof discussionSchema>
  >({
    resolver: zodResolver(discussionSchema),
    defaultValues: {
      content: "",
    },
  });

  const { mutate: onCreateReportDiscussion, isPending } = useMutation({
    mutationFn: (values: CreateReportDiscussionType) =>
      createReportDiscussion(values, getToken),
    onSuccess: (newDiscussion) => {
      socket.emit("discussion", newDiscussion);
      queryClient.invalidateQueries({ queryKey: ["reports", reportId] });
      reset();
    },

    onError: (err) => {
      console.error(err);
    },
  });

  const onSubmit = (values: z.infer<typeof discussionSchema>) => {
    onCreateReportDiscussion({
      ...values,
      reportId: reportId,
      accountId: accountId,
    });
  };

  const [height, setHeight] = useState(40);

  return (
    <View className="flex-row gap-1 px-4 py-2 mb-12">
      <View
        style={{ height: height + 8 }}
        className="flex-row flex-1 gap-2 px-1 py-1 rounded-[28px] bg-primary-200"
      >
        {/* Plus Button */}
        <View className="absolute items-center justify-center rounded-full bottom-1 left-1 size-12 bg-primary-500">
          <Plus size={24} color={"#eeeeee"} />
        </View>

        {/* Expandable Textarea */}
        <Controller
          control={control}
          name="content"
          render={({ field }) => (
            <Textarea
              size="lg"
              style={{ height }}
              className="flex-1 border-0 pe-4"
            >
              <TextareaInput
                placeholder="Report Title"
                value={field.value}
                onChangeText={field.onChange}
                onContentSizeChange={(e) => {
                  const newHeight = e.nativeEvent.contentSize.height;
                  setHeight((prev) => Math.max(40, newHeight));
                }}
                onKeyPress={({ nativeEvent }) => {
                  if (nativeEvent.key === "Enter") {
                    setHeight((prev) => prev + 20); // Manually expand on Enter
                  }
                }}
                className="flex-1 h-full ps-16 font-cereal"
              />
            </Textarea>
          )}
        />

        <Pressable
          onPress={handleSubmit(onSubmit)}
          disabled={isPending}
          className="absolute items-center justify-center rounded-full bottom-1 right-1 size-12 bg-primary-500"
        >
          <Send size={24} color={"#eeeeee"} />
        </Pressable>
      </View>
    </View>
  );
}
