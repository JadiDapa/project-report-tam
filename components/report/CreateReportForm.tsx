import React, { useState } from "react";
import { View, Text, Pressable, TextInput, ScrollView } from "react-native";
import UploadReportEvidences from "./UploadReportEvidences";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@clerk/clerk-expo";
import { useCustomToast } from "@/lib/useToast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Redirect, useRouter } from "expo-router";
import { createReport } from "@/lib/network/report";
import { CreateReportType } from "@/lib/types/report";
import { getProjectById } from "@/lib/network/project";
import LoadingScreen from "@/components/LoadingScreen";
import FloatingInput from "../FloatingInput";
import { useAccount } from "@/contexts/AccountContexts";

const reportSchema = z.object({
  title: z.string().min(1, "Title Must Be Filled"),
  serialNumber: z.string().min(1, "Serial Number Must Be Filled"),
  location: z.string().min(1, "Location Must Be Filled"),
  description: z.string().min(1, "Description Must Be Filled"),
  volume: z.string().optional(),
});

export default function CreateReportForm({ projectId }: { projectId: string }) {
  const [uploadedEvidences, setUploadedEvidences] = useState<any[]>([]);

  const { getToken } = useAuth();

  const { showToast } = useCustomToast();
  const queryClient = useQueryClient();
  const router = useRouter();

  const { account, loading } = useAccount();

  if (loading || !account) return <Text>Loading account...</Text>;

  const { data: project } = useQuery({
    queryFn: () => getProjectById(projectId, getToken),
    queryKey: ["project"],
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof reportSchema>>({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      serialNumber: "",
      location: "",
      title: "",
      description: "",
      volume: "",
    },
  });

  const { mutate: onCreateReport, isPending } = useMutation({
    mutationFn: (values: CreateReportType) => createReport(values, getToken),
    onSuccess: () => {
      showToast("Success", "Project Report Added Successfully");
      queryClient.invalidateQueries({ queryKey: ["reports", projectId] });
      router.push({
        pathname: "/project/[id]",
        params: { id: projectId },
      });
    },
    onError: (err) => {
      console.log(err);
      showToast("Error", err?.message || "Failed To Create Report");
    },
  });

  const onSubmit = (values: z.infer<typeof reportSchema>) => {
    if (projectId && account) {
      onCreateReport({
        ...values,
        projectId: projectId,
        accountId: account.id,
        ReportEvidences: uploadedEvidences,
      });
    }
  };

  if (!project || !account) return <LoadingScreen />;

  const isEmployee = project.Employees.find(
    (emp) => emp.Account.id === account?.id
  );

  if (!isEmployee) return <Redirect href={"/"} />;

  return (
    <View className="relative">
      <ScrollView>
        <View className="flex-row justify-between gap-6 px-6 mt-8 mb-7">
          <View className="relative flex-1 ">
            <Text className="text-sm font-cereal-medium">Project</Text>
            <Text className="text-lg text-primary-500 font-cereal-medium ">
              {project.title}
            </Text>
          </View>
        </View>

        {/* Report Name */}
        <View className="relative px-6 mb-7">
          <Controller
            control={control}
            name="title"
            render={({ field }) => (
              <FloatingInput
                label="Report Title"
                value={field.value}
                onChangeText={field.onChange}
              />
            )}
          />
          {errors.title && (
            <Text className="mt-1 text-red-400 font-cereal-regular">
              {errors.title.message}
            </Text>
          )}
        </View>

        {/* Report Location */}
        <View className="relative px-6 mb-7">
          <Controller
            control={control}
            name="location"
            render={({ field }) => (
              <FloatingInput
                label="Report Location"
                value={field.value}
                onChangeText={field.onChange}
              />
            )}
          />
          {errors.location && (
            <Text className="mt-1 text-red-400 font-cereal-regular">
              {errors.location.message}
            </Text>
          )}
        </View>
        {/* Serial Number */}
        <View className="relative px-6 mb-7">
          <Controller
            control={control}
            name="serialNumber"
            render={({ field }) => (
              <FloatingInput
                label="Device Serial Number"
                value={field.value}
                onChangeText={field.onChange}
              />
            )}
          />
          {errors.serialNumber && (
            <Text className="mt-1 text-red-400 font-cereal-regular">
              {errors.serialNumber.message}
            </Text>
          )}
        </View>

        {/* Report Description */}
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

        <UploadReportEvidences
          uploadedEvidences={uploadedEvidences}
          setUploadedEvidences={setUploadedEvidences}
        />
      </ScrollView>

      {/* Submit Button */}
      <View className="w-full px-6 py-4 bg-white border-t shadow-md mt-7 border-slate-200">
        <Pressable onPress={handleSubmit(onSubmit)} disabled={isPending}>
          <Text className="px-6 py-4 text-lg text-center text-white rounded-md shadow-lg font bg-primary-500 font-cereal-medium shadow-primary-500/50">
            {isPending ? "Upload..." : "Submit Report"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
