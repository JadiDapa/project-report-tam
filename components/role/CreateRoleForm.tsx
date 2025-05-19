import { View, Text, Pressable } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createRole } from "@/lib/network/role";
import * as z from "zod";
import { useCustomToast } from "@/lib/useToast";
import { useRouter } from "expo-router";
import { CreateRoleType } from "@/lib/types/role";
import FloatingInput from "../FloatingInput";
import SelectFeatures from "./SelectFeatures";

const roleSchema = z.object({
  name: z.string().min(1, "Role Name is required"),
  description: z.string().min(1, "Description is required"),
  features: z.array(z.any()),
});

export default function CreateRoleForm() {
  const { showToast } = useCustomToast();
  const queryClient = useQueryClient();
  const router = useRouter();

  const {
    control,
    handleSubmit,

    formState: { errors },
  } = useForm<z.infer<typeof roleSchema>>({
    resolver: zodResolver(roleSchema),
    defaultValues: {
      name: "",
      description: "",
      features: [],
    },
  });

  const { mutate: OnCreateRole, isPending } = useMutation({
    mutationFn: (values: CreateRoleType) => createRole(values),

    onSuccess: () => {
      showToast("Success", "New Role Created Successfully");
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      router.push("/account/create");
    },

    onError: (err) => {
      console.log(err);
      showToast("Error", "Failed To Create Role");
    },
  });

  async function onSubmit(values: z.infer<typeof roleSchema>) {
    //  const data = {
    //    ...values,
    //    Employees: selectedEmployees.map((account) => {
    //      return { id: account };
    //    }),
    //  };
    OnCreateRole(values);
  }

  return (
    <View className="px-6 mt-12 mb-24 gap-7 ">
      {/* Role Full Name */}
      <View className="relative">
        <Controller
          control={control}
          name="name"
          render={({ field }) => (
            <FloatingInput
              label="Role Name"
              value={field.value}
              onChangeText={field.onChange}
            />
          )}
        />
        {errors.name && (
          <Text className="mt-1 text-red-400 font-cereal-regular">
            {errors.name.message}
          </Text>
        )}
      </View>

      {/* Role Full Name */}
      <View className="relative">
        <Controller
          control={control}
          name="description"
          render={({ field }) => (
            <FloatingInput
              label="Description"
              value={field.value}
              onChangeText={field.onChange}
            />
          )}
        />
        {errors.description && (
          <Text className="mt-1 text-red-400 font-cereal-regular">
            {errors.description.message}
          </Text>
        )}
      </View>

      {/* Account Role */}
      <View className="relative">
        <Controller
          control={control}
          name="features"
          render={({ field }) => (
            <SelectFeatures value={field.value} onChange={field.onChange} />
          )}
        />
        {errors.features && (
          <Text className="mt-1 text-red-400 font-cereal-regular">
            {errors.features.message}
          </Text>
        )}
      </View>

      {/* Submit Button */}
      <Pressable
        className="w-full py-4 mt-6 rounded-full bg-primary-500"
        onPress={handleSubmit(onSubmit)}
        disabled={isPending}
      >
        <Text className="text-xl text-center text-white font-cereal-bold">
          {isPending ? "Creating..." : "Create Role"}
        </Text>
      </Pressable>
    </View>
  );
}
