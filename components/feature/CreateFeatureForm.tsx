import { View, Text, Pressable } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFeature } from "@/lib/network/feature";
import * as z from "zod";
import { useCustomToast } from "@/lib/useToast";
import { useRouter } from "expo-router";
import { CreateFeatureType } from "@/lib/types/feature";
import FloatingInput from "../FloatingInput";

const featureSchema = z.object({
  name: z.string().min(1, "Feature Name is required"),
  description: z.string().min(1, "Description is required"),
});

export default function CreateFeatureForm() {
  const { showToast } = useCustomToast();
  const queryClient = useQueryClient();
  const router = useRouter();

  const {
    control,
    handleSubmit,

    formState: { errors },
  } = useForm<z.infer<typeof featureSchema>>({
    resolver: zodResolver(featureSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const { mutate: OnCreateFeature, isPending } = useMutation({
    mutationFn: (values: CreateFeatureType) => createFeature(values),

    onSuccess: () => {
      showToast("Success", "New Feature Created Successfully");
      queryClient.invalidateQueries({ queryKey: ["features"] });
      router.push("/role/create");
    },

    onError: (err) => {
      console.log(err);
      showToast("Error", "Failed To Create Feature");
    },
  });

  async function onSubmit(values: z.infer<typeof featureSchema>) {
    OnCreateFeature(values);
  }

  return (
    <View className="px-6 mt-12 mb-24 gap-7 ">
      {/* Feature Full Name */}
      <View className="relative">
        <Controller
          control={control}
          name="name"
          render={({ field }) => (
            <FloatingInput
              label="Feature Name"
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

      {/* Feature Full Name */}
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

      {/* Submit Button */}
      <Pressable
        className="w-full py-4 mt-6 rounded-full bg-primary-500"
        onPress={handleSubmit(onSubmit)}
        disabled={isPending}
      >
        <Text className="text-xl text-center text-white font-cereal-bold">
          {isPending ? "Creating..." : "Create Feature"}
        </Text>
      </Pressable>
    </View>
  );
}
