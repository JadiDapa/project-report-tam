import { View, Text, Pressable } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createDailyReport,
  getDailyReportById,
  updateDailyReport,
} from "@/lib/network/daily-report";
import * as z from "zod";
import { useCustomToast } from "@/lib/useToast";
import { useRouter } from "expo-router";
import { CreateDailyReportType } from "@/lib/types/daily-report";
import FloatingInput from "../FloatingInput";
import UploadReportEvidences from "../report/UploadReportEvidences";
import { useState } from "react";
import { useAccount } from "@/contexts/AccountContexts";

const dailyReportSchema = z.object({
  title: z.string().min(1, "DailyReport Name is required"),
  description: z.string().min(1, "Description is required"),
  accountId: z.number(),
});

export default function UpdateDailyReportForm({ id }: { id: string }) {
  const { showToast } = useCustomToast();
  const queryClient = useQueryClient();
  const router = useRouter();

  const { account } = useAccount();

  const { data: dailyReport } = useQuery({
    queryFn: () => getDailyReportById(id),
    queryKey: ["daily-report", id],
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof dailyReportSchema>>({
    resolver: zodResolver(dailyReportSchema),
    defaultValues: {
      title: dailyReport?.title || "",
      description: dailyReport?.title || "",
      accountId: (dailyReport?.accountId as number) || account?.id,
    },
  });

  const [uploadedEvidences, setUploadedEvidences] = useState<any[]>(
    dailyReport?.DailyReportEvidences || []
  );

  const { mutate: OnCreateDailyReport, isPending } = useMutation({
    mutationFn: (values: CreateDailyReportType) =>
      updateDailyReport(id, values),
    onSuccess: () => {
      showToast("Success", "Existing Daily Report Updated Successfully");
      queryClient.invalidateQueries({ queryKey: ["daily-reports", id] });
      router.push(`/daily-report/account/${account?.id}`);
    },

    onError: (error: any) => {
      console.error("Raw error:", error);

      let message = "Failed To Update Daily Report";
      let details = "";

      // Axios-style error response
      if (error?.response) {
        message = error.response.data?.message || message;

        // Optionally capture causes/validation errors
        if (Array.isArray(error.response.data?.errors)) {
          details = error.response.data.errors
            .map((e: any) => `• ${e.message}`)
            .join("\n");
        } else if (typeof error.response.data?.cause === "string") {
          details = error.response.data.cause;
        }
      }

      showToast("Error", `${message}${details ? "\n" + details : ""}`);
    },
  });

  async function onSubmit(values: z.infer<typeof dailyReportSchema>) {
    if (account) {
      OnCreateDailyReport({
        ...values,
        accountId: account.id,
        DailyReportEvidences: uploadedEvidences,
      });
    }
  }

  return (
    <View className="flex-col justify-between flex-1 mt-14">
      <View>
        {/* DailyReport Full Name */}
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

        {/* DailyReport Full Name */}
        <View className="relative px-6 mb-6 ">
          <Controller
            control={control}
            name="description"
            render={({ field }) => (
              <FloatingInput
                label="Description"
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

        <View>
          <Text className="px-6 text-lg font-cereal-medium">
            Report Evidences
          </Text>
          <UploadReportEvidences
            uploadedEvidences={uploadedEvidences}
            setUploadedEvidences={setUploadedEvidences}
          />
        </View>
      </View>

      <View className="w-full px-6 py-4 bg-white border-t shadow-md mt-7 border-slate-200">
        <Pressable onPress={handleSubmit(onSubmit)} disabled={isPending}>
          <Text className="px-6 py-4 text-lg text-center text-white rounded-md shadow-lg font bg-primary-500 font-cereal-medium shadow-primary-500/50">
            {isPending ? "Upload..." : "Upload Report"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
