import React, { useState } from "react";
import { View, Text, Pressable, TextInput } from "react-native";
import { Textarea, TextareaInput } from "@/components/ui/textarea";
import UploadReportEvidences from "./UploadReportEvidences";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { useCustomToast } from "@/lib/useToast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Redirect, useRouter } from "expo-router";
import { createReport } from "@/lib/network/report";
import { CreateReportType } from "@/lib/types/report";
import { getAccountByEmail } from "@/lib/network/account";
import { getProjectById } from "@/lib/network/project";
import LoadingScreen from "@/components/LoadingScreen";

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
  const { user } = useUser();

  const { showToast } = useCustomToast();
  const queryClient = useQueryClient();
  const router = useRouter();

  const { data: account } = useQuery({
    queryFn: () =>
      getAccountByEmail(user?.primaryEmailAddress?.emailAddress || ""),
    queryKey: ["account"],
  });

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
    <View className="gap-6 px-6 mt-8 mb-24">
      <View className="flex-row justify-between gap-6">
        <View className="relative flex-1 ">
          <Text className="text-sm font-cereal-medium">Project</Text>
          <Text className="text-lg text-primary-500 font-cereal-medium ">
            {project.title}
          </Text>
        </View>
        <View className="relative items-end flex-1 ">
          <Text className="text-sm text-end font-cereal-medium">Reporter</Text>
          <Text className="text-lg text-end text-primary-500 font-cereal-medium">
            {account.fullname}
          </Text>
        </View>
      </View>

      {/* Report Name */}
      <View className="relative">
        <Text className="text-lg font-cereal-medium">Report Title</Text>

        <Controller
          control={control}
          name="title"
          render={({ field }) => (
            <TextInput
              placeholder="Report Title"
              value={field.value}
              onChangeText={field.onChange}
              className="w-full px-3 mt-3 bg-white h-14 rounded-xl font-cereal-medium"
            />
          )}
        />
        {errors.title && (
          <Text className="text-red-500 font-cereal-medium">
            {errors.title.message}
          </Text>
        )}
      </View>

      {/* Report Location */}
      <View className="relative">
        <Text className="text-lg font-cereal-medium">Report Location</Text>

        <Controller
          control={control}
          name="location"
          render={({ field }) => (
            <TextInput
              placeholder="Report Location"
              value={field.value}
              onChangeText={field.onChange}
              className="w-full px-3 mt-3 bg-white h-14 rounded-xl font-cereal-medium"
            />
          )}
        />
        {errors.location && (
          <Text className="text-red-500 font-cereal-medium">
            {errors.location.message}
          </Text>
        )}
      </View>
      {/* Serial Number */}
      <View className="relative">
        <Text className="text-lg font-cereal-medium">Serial Number</Text>

        <Controller
          control={control}
          name="serialNumber"
          render={({ field }) => (
            <TextInput
              placeholder="Serial Number"
              value={field.value}
              onChangeText={field.onChange}
              className="w-full px-3 mt-3 bg-white h-14 rounded-xl font-cereal-medium"
            />
          )}
        />
        {errors.serialNumber && (
          <Text className="text-red-500 font-cereal-medium">
            {errors.serialNumber.message}
          </Text>
        )}
      </View>

      {/* Report Description */}
      <View className="relative mt-3">
        <Text className="text-lg font-cereal-medium">Report Detail</Text>
        <Controller
          control={control}
          name="description"
          render={({ field }) => (
            <Textarea
              size={"lg"}
              isInvalid={false}
              isDisabled={false}
              className="w-full mt-3 bg-white border-white rounded-xl font-cereal-medium"
            >
              <TextareaInput
                placeholder="Describe Your Report Here"
                value={field.value}
                className=" font-cereal-medium"
                onChangeText={field.onChange}
              />
            </Textarea>
          )}
        />
        {errors.description && (
          <Text className="text-red-500 font-cereal-medium">
            {errors.description.message}
          </Text>
        )}
      </View>

      <UploadReportEvidences
        uploadedEvidences={uploadedEvidences}
        setUploadedEvidences={setUploadedEvidences}
      />

      {/* Submit Button */}
      <Pressable
        className="w-full py-4 mt-6 rounded-full bg-primary-500"
        onPress={handleSubmit(onSubmit)}
        disabled={isPending}
      >
        <Text className="text-xl text-center text-white font-cereal-bold">
          {isPending ? "Creating..." : "Create Report"}
        </Text>
      </Pressable>
    </View>
  );
}
