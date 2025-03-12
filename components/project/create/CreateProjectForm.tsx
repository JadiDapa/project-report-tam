import React, { useState } from "react";
import { View, Text, Pressable, TextInput } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Textarea, TextareaInput } from "@/components/ui/textarea";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createProject } from "@/lib/network/project";
import * as z from "zod";
import SelectEmployee from "./SelectEmployee";
import { useCustomToast } from "@/lib/useToast";
import { useRouter } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";
import { CreateProjectType, ProjectType } from "@/lib/types/project";

const statuses = [
  { label: "Low", value: "low", bgColor: "bg-success-500" },
  { label: "Medium", value: "medium", bgColor: "bg-warning-500" },
  { label: "High", value: "high", bgColor: "bg-error-500" },
];

const projectSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  startDate: z.date(),
  endDate: z.date(),
  status: z.enum(["low", "medium", "high"]),
});

export default function CreateProjectForm() {
  const [openStart, setOpenStart] = useState(false);
  const [openEndDate, setOpenEndDate] = useState(false);
  const [selectedEmployees, setSelectedEmployees] = useState<number[]>([]);

  const { getToken } = useAuth();

  const { showToast } = useCustomToast();
  const queryClient = useQueryClient();
  const router = useRouter();

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<z.infer<typeof projectSchema>>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: "",
      description: "",
      startDate: new Date(),
      endDate: new Date(),
      status: "low",
    },
  });

  const startDate = watch("startDate");
  const endDate = watch("endDate");
  const status = watch("status");

  const { mutate: OnCreateProject, isPending } = useMutation({
    mutationFn: (values: CreateProjectType) => createProject(values, getToken),
    onSuccess: () => {
      showToast("Success", "New Project Created Successfully");
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      router.push("/project");
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
    const data = {
      ...values,
      Employees: selectedEmployees.map((account) => {
        return { id: account };
      }),
    };
    OnCreateProject(data);
  };

  return (
    <View className="gap-4 px-6 mt-8 mb-24">
      {/* Project Name */}
      <View className="relative">
        <Text className="text-lg font-cereal-medium">Project Title</Text>
        <Controller
          control={control}
          name="title"
          render={({ field }) => (
            <TextInput
              placeholder="Project Title"
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

      {/* Project Description */}
      <View className="relative mt-3">
        <Text className="text-lg font-cereal-medium">Project Description</Text>
        <Controller
          control={control}
          name="description"
          render={({ field }) => (
            <Textarea
              size="lg"
              className="w-full mt-3 bg-white border-white rounded-xl font-cereal-medium"
            >
              <TextareaInput
                placeholder="Describe Your Project Here"
                value={field.value}
                onChangeText={field.onChange}
                className="font-cereal-medium"
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

      {/* Date Picker */}
      <View className="flex flex-row items-center gap-3 mt-3">
        {/* Start Date */}
        <View className="relative flex-1">
          <Text className="text-lg font-cereal-medium">Starting Date</Text>
          <Pressable
            onPress={() => setOpenStart(true)}
            className="justify-center w-full px-3 py-3 mt-3 bg-white h-14 rounded-xl"
          >
            <Text className="text-gray-600 font-cereal-medium">
              {startDate.toDateString()}
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
          <Text className="text-lg font-cereal-medium">End Date</Text>
          <Pressable
            onPress={() => setOpenEndDate(true)}
            className="justify-center w-full px-3 py-3 mt-3 bg-white h-14 rounded-xl"
          >
            <Text className="text-gray-600 font-cereal-medium">
              {endDate.toDateString()}
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
      <View className="relative mt-3">
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
                  className={`items-center justify-center h-12 px-3 py-2 mt-3 w-28 rounded-xl ${
                    status === item.value ? item.bgColor : "bg-white"
                  }`}
                >
                  <Text
                    className={`font-cereal-medium ${
                      status === item.value ? "text-white" : "text-gray-600"
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
      <Pressable
        className="w-full py-4 mt-6 rounded-full bg-primary-500"
        onPress={handleSubmit(onSubmit)}
        disabled={isPending}
      >
        <Text className="text-xl text-center text-white font-cereal-bold">
          {isPending ? "Creating..." : "Create Project"}
        </Text>
      </Pressable>
    </View>
  );
}
