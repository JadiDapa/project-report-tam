import React, { useState } from "react";
import { View, Text, Pressable } from "react-native";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@clerk/clerk-expo";
import { useCustomToast } from "@/lib/useToast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Redirect, useRouter } from "expo-router";
import { getTaskById } from "@/lib/network/task";
import LoadingScreen from "@/components/LoadingScreen";
import { useAccount } from "@/contexts/AccountContexts";
import FloatingInput from "@/components/FloatingInput";
import { CreateTaskEvidenceType } from "@/lib/types/task-evidence";
import UploadTaskEvidences from "../UploadTaskEvidences";
import { createTaskEvidence } from "@/lib/network/task-evidence";

const evidenceSchema = z.object({
  description: z.string().min(1, "Description Must Be Filled"),
  taskId: z.string().min(1, "Project ID Must Be Filled"),
  accountId: z.string().min(1, "Project ID Must Be Filled"),
});

export default function CreateTaskEvidenceForm({ taskId }: { taskId: string }) {
  const [uploadedEvidences, setUploadedEvidences] = useState<any>([]);

  const { getToken } = useAuth();
  const { showToast } = useCustomToast();
  const queryClient = useQueryClient();
  const router = useRouter();

  const { account } = useAccount();

  const { data: task } = useQuery({
    queryFn: () => getTaskById(taskId, getToken),
    queryKey: ["tasks", taskId],
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof evidenceSchema>>({
    resolver: zodResolver(evidenceSchema),
    defaultValues: {
      description: "",
      taskId: taskId,
      accountId: account?.id.toString(),
    },
  });

  const { mutate: onCreateTaskEvidence, isPending } = useMutation({
    mutationFn: (values: CreateTaskEvidenceType) => createTaskEvidence(values),
    onSuccess: () => {
      showToast("Success", "Project Task Added Successfully");
      queryClient.invalidateQueries({ queryKey: ["tasks", taskId] });
      router.push({
        pathname: "/task/[id]",
        params: { id: taskId },
      });
    },
    onError: (err) => {
      console.log(err);
      showToast("Error", err?.message || "Failed To Create Task");
    },
  });

  const onSubmit = (values: z.infer<typeof evidenceSchema>) => {
    console.log("Form", {
      description: values.description,
      taskId: Number(values.taskId),
      accountId: account?.id,
      image: uploadedEvidences,
    });
    onCreateTaskEvidence({
      description: values.description,
      taskId: Number(values.taskId),
      title: values.description,
    });
  };

  if (!task || !account) return <LoadingScreen />;

  const isProjectManager = account.Role.Features?.some(
    (feature) => feature.name === "Manage Project"
  );

  if (!isProjectManager) return <Redirect href={"/"} />;

  return (
    <View className="relative flex-1 ">
      <View className="flex-row justify-between gap-6 px-6 mt-8 mb-7">
        <View className="relative flex-1 ">
          <Text className="text-sm font-cereal-medium">Task</Text>
          <Text className="text-lg text-primary-500 font-cereal-medium ">
            {`${task.type} ${task.item}  ${task.quantity} Unit`}
          </Text>
        </View>
      </View>

      {/* Task Description */}
      <View className="relative px-6 mb-7">
        <Controller
          control={control}
          name="description"
          render={({ field }) => (
            <FloatingInput
              label="Detail"
              value={field.value}
              onChangeText={field.onChange}
              multiline
              numberOfLines={6}
            />
          )}
        />
        {errors.description && (
          <Text className="mt-1 text-red-400 font-cereal-regular">
            {errors.description.message}
          </Text>
        )}
      </View>

      <UploadTaskEvidences
        uploadedEvidences={uploadedEvidences}
        setUploadedEvidences={setUploadedEvidences}
      />

      {/* Submit Button */}
      <View className="w-full px-6 py-4 mt-3 border-slate-200">
        <Pressable onPress={handleSubmit(onSubmit)} disabled={isPending}>
          <Text className="px-6 py-4 text-lg text-center text-white rounded-md shadow-lg font bg-primary-500 font-cereal-medium shadow-primary-500/50">
            {isPending ? "Upload..." : "Submit Task"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
