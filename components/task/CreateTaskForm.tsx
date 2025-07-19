import { View, Text, Pressable } from "react-native";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@clerk/clerk-expo";
import { useCustomToast } from "@/lib/useToast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Redirect, useRouter } from "expo-router";
import { CreateTaskType } from "@/lib/types/task";
import LoadingScreen from "@/components/LoadingScreen";
import FloatingInput from "../FloatingInput";
import { useAccount } from "@/contexts/AccountContexts";
import SelectSingleInput from "../SelectSingleInput";
import { getProjectById } from "@/lib/network/project";
import { createTask } from "@/lib/network/task";

const taskSchema = z.object({
  type: z.string().min(1, "Type Must Be Filled"),
  item: z.string().min(1, "Item Must Be Filled"),
  quantity: z.string().min(1, "Quantity Must Be Filled"),
  description: z.string().min(1, "Description Must Be Filled"),
  projectId: z.string().min(1, "Project ID Must Be Filled"),
});

export const projectType = [
  {
    label: "Installation",
    value: "installation",
  },
  {
    label: "Configuration",
    value: "configuration",
  },
  {
    label: "Maintanance",
    value: "maintanance",
  },
];

export default function CreateTaskForm({ projectId }: { projectId: string }) {
  const { getToken } = useAuth();

  const { showToast } = useCustomToast();
  const queryClient = useQueryClient();
  const router = useRouter();

  const { account } = useAccount();

  const { data: project } = useQuery({
    queryFn: () => getProjectById(projectId, getToken),
    queryKey: ["project"],
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof taskSchema>>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      type: "",
      item: "",
      quantity: "",
      description: "",
      projectId: projectId || "",
    },
  });

  const { mutate: onCreateTask, isPending } = useMutation({
    mutationFn: (values: CreateTaskType) => createTask(values),
    onSuccess: () => {
      showToast("Success", "Project Task Added Successfully");
      queryClient.invalidateQueries({ queryKey: ["projects", projectId] });
      queryClient.invalidateQueries({ queryKey: ["tasks"] });

      router.push({
        pathname: "/project/[id]",
        params: { id: projectId },
      });
    },
    onError: (err) => {
      console.log(err);
      showToast("Error", err?.message || "Failed To Create Task");
    },
  });

  const onSubmit = (values: z.infer<typeof taskSchema>) => {
    onCreateTask({
      ...values,
      quantity: Number(values.quantity),
      projectId: Number(values.projectId),
    });
  };

  if (!project || !account) return <LoadingScreen />;

  const isProjectManager = account.Role.Features?.some(
    (feature) => feature.name === "Manage Project"
  );

  if (!isProjectManager) return <Redirect href={"/"} />;

  return (
    <View className="relative flex-1 ">
      <View className="flex-row justify-between gap-6 px-6 mt-8 mb-7">
        <View className="relative flex-1 ">
          <Text className="text-sm font-cereal-medium">Project</Text>
          <Text className="text-lg text-primary-500 font-cereal-medium ">
            {project.title}
          </Text>
        </View>
      </View>

      {/* Account Type */}
      <View className="relative px-6 mb-7">
        <Controller
          control={control}
          name="type"
          render={({ field }) => (
            <SelectSingleInput
              value={field.value}
              options={projectType}
              onChange={field.onChange}
              placeholder="Select Task Type"
            />
          )}
        />
        {errors.type && (
          <Text className="mt-1 text-red-400 font-cereal-regular">
            {errors.type.message}
          </Text>
        )}
      </View>

      {/* Task Name */}
      <View className="relative px-6 mb-7">
        <Controller
          control={control}
          name="item"
          render={({ field }) => (
            <FloatingInput
              label="Item/Device"
              value={field.value}
              onChangeText={field.onChange}
            />
          )}
        />
        {errors.item && (
          <Text className="mt-1 text-red-400 font-cereal-regular">
            {errors.item.message}
          </Text>
        )}
      </View>

      <View className="relative px-6 mb-7">
        <Controller
          control={control}
          name="quantity"
          render={({ field }) => (
            <FloatingInput
              label="Quantity"
              value={field.value}
              onChangeText={field.onChange}
              keyboardType="numeric"
            />
          )}
        />
        {errors.quantity && (
          <Text className="mt-1 text-red-400 font-cereal-regular">
            {errors.quantity.message}
          </Text>
        )}
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
