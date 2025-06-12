import React, { useState } from "react";
import { View, Text, Pressable } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { updateProject, getProjectById } from "@/lib/network/project";
import * as z from "zod";
import { useCustomToast } from "@/lib/useToast";
import { useRouter } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";
import { CreateProjectType } from "@/lib/types/project";
import FloatingInput from "@/components/FloatingInput";
import SelectEmployee from "../create/SelectEmployee";
import Loading from "@/components/LoadingScreen";
import { format } from "date-fns";
import { getAllAccounts } from "@/lib/network/account";

const statuses = [
  {
    label: "Low",
    value: "low",
    bgColor: "bg-success-200 text-success-700 border-success-500",
  },
  {
    label: "Medium",
    value: "medium",
    bgColor: "bg-warning-200 text-warning-700 border-warning-500",
  },
  {
    label: "High",
    value: "high",
    bgColor: "bg-error-200 text-error-700 border-error-500",
  },
];

const projectSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  startDate: z.date(),
  endDate: z.date(),
  status: z.string(),
});

export default function UpdateProjectForm({ id }: { id: string }) {
  const [openStart, setOpenStart] = useState(false);
  const [openEndDate, setOpenEndDate] = useState(false);

  const { showToast } = useCustomToast();
  const queryClient = useQueryClient();
  const router = useRouter();
  const { getToken } = useAuth();

  const { data: project } = useQuery({
    queryFn: () => getProjectById(id, getToken),
    queryKey: ["project", id],
  });

  const { data: accounts } = useQuery({
    queryFn: () => getAllAccounts(),
    queryKey: ["accounts"],
  });

  console.log(project?.Employees);

  const [selectedEmployees, setSelectedEmployees] = useState<number[]>(
    project?.Employees?.map((emp) => emp.id) ?? []
  );

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<z.infer<typeof projectSchema>>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: project?.title || "",
      description: project?.description || "",
      startDate: project?.startDate ? new Date(project.startDate) : new Date(),
      endDate: project?.endDate ? new Date(project.endDate) : new Date(),
      status: project?.status || "low",
    },
  });

  const startDate = watch("startDate");
  const endDate = watch("endDate");
  const status = watch("status");

  const { mutate: OnCreateProject, isPending } = useMutation({
    mutationFn: (values: CreateProjectType) =>
      updateProject(id, values, getToken),
    onSuccess: () => {
      showToast("Success", "Project Updated Successfully");
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      router.push({ pathname: "/project/[id]", params: { id } });
    },
    onError: (err) => {
      console.log(err);
      showToast("Error", "Failed To Create Project");
    },
  });

  function handleSelectEmployees(accountId: number) {
    setSelectedEmployees((prev) => {
      if (prev.includes(accountId)) {
        return prev.filter((id) => id !== accountId);
      } else {
        return [...prev, accountId];
      }
    });
  }

  const onSubmit = (values: z.infer<typeof projectSchema>) => {
    console.log("Submitting...", values);
    const data = {
      ...values,
      Employees: selectedEmployees.map((account) => {
        return { id: account };
      }),
    };
    OnCreateProject(data);
  };

  if (!project) return <Loading />;

  return (
    <View className="relative flex-1 gap-4 mt-8 ">
      <View className="relative px-6 mb-7">
        <Controller
          control={control}
          name="title"
          render={({ field }) => (
            <FloatingInput
              label="Reason"
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
      {/* Project Description */}
      <View className="relative px-6 mb-7">
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

      {/* Date Picker */}
      <View className="relative flex flex-row items-center gap-3 px-6 mb-2">
        {/* Start Date */}
        <View className="relative flex-1">
          <Text className="text-lg font-cereal-regular">Starting Date</Text>
          <Pressable
            onPress={() => setOpenStart(true)}
            className="justify-center w-full px-3 py-3 mt-3 bg-white border rounded-md border-slate-300 h-14"
          >
            <Text className="text-gray-600 font-cereal-regular">
              {format(startDate, "dd MMMM yyyy")}
            </Text>
          </Pressable>
          {openStart && (
            <DateTimePicker
              value={startDate}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                setOpenStart(false);
                if (selectedDate) setValue("startDate", selectedDate);
              }}
            />
          )}
        </View>

        {/* End Date */}
        <View className="relative flex-1">
          <Text className="text-lg font-cereal-regular">End Date</Text>
          <Pressable
            onPress={() => setOpenEndDate(true)}
            className="justify-center w-full px-3 py-3 mt-3 bg-white border rounded-md border-slate-300 h-14"
          >
            <Text className="text-gray-600 font-cereal-regular">
              {format(endDate, "dd MMMM yyyy")}
            </Text>
          </Pressable>
          {openEndDate && (
            <DateTimePicker
              value={endDate}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                setOpenEndDate(false);
                if (selectedDate) setValue("endDate", selectedDate);
              }}
            />
          )}
        </View>
      </View>

      <SelectEmployee
        selectedEmployees={selectedEmployees}
        handleSelectEmployees={handleSelectEmployees}
      />

      {/* Priority Selection */}
      <View className="relative px-6 mb-32">
        <Text className="text-lg font-cereal-medium">Priority</Text>
        <View className="flex-row justify-between">
          {statuses.map((item) => (
            <Controller
              key={item.value}
              control={control}
              name="status"
              render={({ field }) => (
                <Pressable
                  onPress={() => field.onChange(item.value)}
                  className={`items-center justify-center border-slate-300 border h-12 px-3 py-2 mt-3 w-28 rounded-xl ${
                    status === item.value ? item.bgColor : "bg-white "
                  }`}
                >
                  <Text
                    className={`font-cereal-medium ${
                      status === item.value ? item.bgColor : "text-slate-500"
                    }`}
                  >
                    {item.label}
                  </Text>
                </Pressable>
              )}
            />
          ))}
        </View>
      </View>

      {/* Submit Button */}

      <View className="absolute bottom-0 w-full px-6 py-4 bg-white border-t shadow-md border-slate-200">
        <Pressable
          disabled={isPending}
          onPress={handleSubmit(onSubmit)}
          className="flex-1"
        >
          <Text className="px-6 py-4 text-lg text-center text-white rounded-md shadow-lg font bg-primary-500 font-cereal-medium shadow-primary-500/50">
            {isPending ? "Creating..." : "Submit"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
