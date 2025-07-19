import { View, Text, Pressable } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createAccount } from "@/lib/network/account";
import * as z from "zod";
import { useCustomToast } from "@/lib/useToast";
import { useRouter } from "expo-router";
import { useSignUp } from "@clerk/clerk-expo";
import { CreateAccountType } from "@/lib/types/account";
import SelectRole from "./SelectRole";
import FloatingInput from "../FloatingInput";
import { getAllFeatures } from "@/lib/network/feature";

const accountSchema = z
  .object({
    fullname: z.string().min(3, "Full Name must be at least 3 characters"),
    email: z.string().min(10, "Description must be at least 10 characters"),
    role: z.string(),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z
      .string()
      .min(6, "Password must be at least 6 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"], // put error on confirmPassword field
  });

export default function CreateAccountForm() {
  const { showToast } = useCustomToast();
  const queryClient = useQueryClient();
  const router = useRouter();
  const { signUp } = useSignUp();

  const { data: features } = useQuery({
    queryFn: () => getAllFeatures(),
    queryKey: ["features"],
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof accountSchema>>({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      fullname: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const { mutate: OnCreateAccount, isPending } = useMutation({
    mutationFn: (values: CreateAccountType) => createAccount(values),

    onSuccess: () => {
      showToast("Success", "New Account Created Successfully");
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      router.push("/employee");
    },
    onError: (err) => {
      console.log(err);
      showToast("Error", "Failed To Create Account");
    },
  });

  async function onSubmit(values: z.infer<typeof accountSchema>) {
    try {
      const roleId =
        features!.find((feature) => feature.name === values.role)?.id ?? 0;

      await OnCreateAccount({
        fullname: values.fullname,
        email: values.email,
        password: values.password,
        roleId,
      });

      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      showToast("Success", "Account Successfully Created!");
      router.push("/employee");
    } catch (err) {
      console.error("Account creation failed", err);
      showToast("Error", "Failed to create account");
    }
  }

  return (
    <View className="px-6 mt-12 mb-24 gap-7 ">
      {/* Account Full Name */}
      <View className="relative">
        <Controller
          control={control}
          name="fullname"
          render={({ field }) => (
            <FloatingInput
              label="Full Name"
              value={field.value}
              onChangeText={field.onChange}
            />
          )}
        />
        {errors.fullname && (
          <Text className="mt-1 text-red-400 font-cereal-regular">
            {errors.fullname.message}
          </Text>
        )}
      </View>

      {/* Account Full Name */}
      <View className="relative">
        <Controller
          control={control}
          name="email"
          render={({ field }) => (
            <FloatingInput
              label="Email Address"
              value={field.value}
              onChangeText={field.onChange}
            />
          )}
        />
        {errors.email && (
          <Text className="mt-1 text-red-400 font-cereal-regular">
            {errors.email.message}
          </Text>
        )}
      </View>

      {/* Account Password */}
      <View className="relative">
        <Controller
          control={control}
          name="password"
          render={({ field }) => (
            <FloatingInput
              label="Password"
              value={field.value}
              onChangeText={field.onChange}
            />
          )}
        />
        {errors.password && (
          <Text className="mt-1 text-red-400 font-cereal-regular">
            {errors.password.message}
          </Text>
        )}
      </View>

      {/* Account Password */}
      <View className="relative">
        <Controller
          control={control}
          name="confirmPassword"
          render={({ field }) => (
            <FloatingInput
              label="Confirm Password"
              value={field.value.toString()}
              onChangeText={field.onChange}
            />
          )}
        />
        {errors.confirmPassword && (
          <Text className="mt-1 text-red-400 font-cereal-regular">
            {errors.confirmPassword.message}
          </Text>
        )}
      </View>

      {/* Account Role */}
      <View className="relative">
        <Controller
          control={control}
          name="role"
          render={({ field }) => (
            <SelectRole value={field.value} onChange={field.onChange} />
          )}
        />
        {errors.role && (
          <Text className="mt-1 text-red-400 font-cereal-regular">
            {errors.role.message}
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
          {isPending ? "Creating..." : "Create Account"}
        </Text>
      </Pressable>
    </View>
  );
}
