import { useAccount } from "@/contexts/AccountContexts";
import { AccountType, CreateAccountType } from "@/lib/types/account";
import { User } from "lucide-react-native";
import { Controller, useForm } from "react-hook-form";
import { View, Image, Text, Pressable, Alert } from "react-native";
import FloatingInput from "../FloatingInput";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateAccount } from "@/lib/network/account";
import { useCustomToast } from "@/lib/useToast";
import { router } from "expo-router";
import SelectRole from "../account/SelectRole";

const accountSchema = z.object({
  fullname: z.string().min(1, "Full Name is required"),
  email: z.string().min(1, "Email is required"),
  phoneNumber: z.string().min(1, "Phone Number is required"),
  roleId: z.string().min(1, "Role is required"),
  image: z.string().optional(),
});

export default function EditAccountForm() {
  const { account, loading } = useAccount();

  const { showToast } = useCustomToast();
  const queryClient = useQueryClient();
  const { refetch } = useAccount();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof accountSchema>>({
    resolver: zodResolver(accountSchema),
    values: {
      fullname: account?.fullname || "",
      email: account?.email || "",
      phoneNumber: account?.phoneNumber || "",
      roleId: account?.roleId.toString() || "",
      image: account?.image || "",
    },
  });

  const { mutate: OnUpdateAccount, isPending } = useMutation({
    mutationFn: (values: CreateAccountType) =>
      updateAccount(account!.id.toString(), values),

    onSuccess: () => {
      showToast("Success", "Account Updated Successfully");
      queryClient.invalidateQueries({ queryKey: ["accounts", account!.email] });
      refetch();
      router.push("/profile");
    },

    onError: (err) => {
      console.log(err);
      showToast("Error", "Failed To Update Your Account");
    },
  });

  async function onSubmit(values: z.infer<typeof accountSchema>) {
    OnUpdateAccount({ ...values, roleId: parseInt(values.roleId) });
  }

  function confirmAndSubmit() {
    Alert.alert(
      "Confirm Update",
      "Are you sure you want to update this account?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Yes",
          style: "destructive",
          onPress: () => handleSubmit(onSubmit)(),
        },
      ]
    );
  }

  if (loading || !account) return <Text>Loading account...</Text>;

  return (
    <View className="relative flex-1 gap-4 mt-8 ">
      <View className="flex-row justify-center">
        <View className="relative overflow-hidden rounded-full size-32">
          <Image
            source={{
              uri:
                account.image ||
                "https://cdn.vectorstock.com/i/500p/08/19/gray-photo-placeholder-icon-design-ui-vector-35850819.jpg",
            }}
            className="object-cover object-center w-full h-full"
          />
        </View>
      </View>

      {/* Account Full Name */}
      <View className="relative px-6 mb-7">
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

      {/* Account Email */}
      <View className="relative px-6 mb-7">
        <Controller
          control={control}
          name="email"
          render={({ field }) => (
            <FloatingInput
              label="Email"
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

      {/* Account Email */}
      <View className="relative px-6 mb-7">
        <Controller
          control={control}
          name="phoneNumber"
          render={({ field }) => (
            <FloatingInput
              label="Phone Number"
              value={field.value}
              onChangeText={field.onChange}
            />
          )}
        />
        {errors.phoneNumber && (
          <Text className="mt-1 text-red-400 font-cereal-regular">
            {errors.phoneNumber.message}
          </Text>
        )}
      </View>

      {/* Account Role */}
      <View className="relative px-6 mb-7">
        <Controller
          control={control}
          name="roleId"
          render={({ field }) => (
            <SelectRole value={field.value} onChange={field.onChange} />
          )}
        />
        {errors.roleId && (
          <Text className="mt-1 text-red-400 font-cereal-regular">
            {errors.roleId.message}
          </Text>
        )}
      </View>

      {/* Submit Button */}

      <View className="absolute bottom-0 w-full px-6 py-4 bg-white border-t shadow-md border-slate-200">
        <Pressable
          disabled={isPending}
          onPress={confirmAndSubmit}
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
