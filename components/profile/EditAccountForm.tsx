import React, { useState } from "react";
import { useAccount } from "@/contexts/AccountContexts";
import { CreateAccountType } from "@/lib/types/account";
import { Controller, useForm } from "react-hook-form";
import { View, Image, Text, Pressable, Alert } from "react-native";
import FloatingInput from "../FloatingInput";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateAccount } from "@/lib/network/account";
import { useCustomToast } from "@/lib/useToast";
import { router } from "expo-router";
import SelectRole from "../account/SelectRole";
import * as z from "zod";

// Added optional password
const accountSchema = z.object({
  fullname: z.string().min(1, "Full Name is required"),
  email: z.string().min(1, "Email is required"),
  phoneNumber: z.string().min(1, "Phone Number is required"),
  roleId: z.string().min(1, "Role is required"),
  image: z.string().optional(),
  password: z.string().optional(),
});

export default function EditAccountForm() {
  const { account, loading } = useAccount();
  const { showToast } = useCustomToast();
  const queryClient = useQueryClient();
  const { refetch } = useAccount();

  const [showPasswordUpdate, setShowPasswordUpdate] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof accountSchema>>({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      fullname: account?.fullname || "",
      email: account?.email || "",
      phoneNumber: account?.phoneNumber || "",
      roleId: account?.roleId.toString() || "",
      image: account?.image || "",
      password: "", // initialize password as empty
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
      console.error(err);
      showToast("Error", "Failed To Update Your Account");
    },
  });

  async function onSubmit(values: z.infer<typeof accountSchema>) {
    // Only send password if provided
    const payload: any = { ...values, roleId: parseInt(values.roleId) };
    if (!values.password) delete payload.password;
    OnUpdateAccount(payload);
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

  // Toggle Role field
  const hasManageAccountFeature = account?.Role?.Features?.some(
    (feature) => feature.name === "Manage Account"
  );

  if (loading || !account) return <Text>Loading account...</Text>;

  return (
    <View className="relative flex-1 gap-4 mt-8 ">
      {/* Avatar */}
      <View className="flex-row justify-center">
        <View className="relative overflow-hidden rounded-full size-32">
          <Image
            source={{
              uri:
                account.image ||
                "https://st3.depositphotos.com/6672868/13701/v/450/depositphotos_137014128-stock-illustration-user-profile-icon.jpg",
            }}
            className="object-cover object-center w-full h-full"
          />
        </View>
      </View>

      {/* Full Name */}
      <View className="px-6 mb-7">
        <Controller
          control={control}
          name="fullname"
          render={({ field }) => (
            <FloatingInput
              label="Full Name"
              value={field.value ?? ""}
              onChangeText={field.onChange}
            />
          )}
        />
        {errors.fullname && (
          <Text className="text-red-400">{errors.fullname.message}</Text>
        )}
      </View>

      {/* Email */}
      <View className="px-6 mb-7">
        <Controller
          control={control}
          name="email"
          render={({ field }) => (
            <FloatingInput
              label="Email"
              value={field.value ?? ""}
              onChangeText={field.onChange}
              disabled
            />
          )}
        />
        {errors.email && (
          <Text className="text-red-400">{errors.email.message}</Text>
        )}
      </View>

      {/* Phone */}
      <View className="px-6 mb-7">
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
          <Text className="text-red-400">{errors.phoneNumber.message}</Text>
        )}
      </View>

      {/* Role picker, only if allowed */}
      {hasManageAccountFeature && (
        <View className="px-6 mb-7">
          <Controller
            control={control}
            name="roleId"
            render={({ field }) => (
              <SelectRole value={field.value} onChange={field.onChange} />
            )}
          />
          {errors.roleId && (
            <Text className="text-red-400">{errors.roleId.message}</Text>
          )}
        </View>
      )}

      {/* Change password */}
      <View className="px-6 mb-2">
        <Pressable
          onPress={() => setShowPasswordUpdate(!showPasswordUpdate)}
          className="px-4 py-3 bg-red-500 rounded-md"
        >
          <Text className="text-center text-white font-cereal-regular">
            {showPasswordUpdate
              ? "Cancel Password Change"
              : "Click To Change Password"}
          </Text>
        </Pressable>
      </View>

      {/* Password input */}
      {showPasswordUpdate && (
        <View className="px-6 mb-7">
          <Controller
            control={control}
            name="password"
            render={({ field }) => (
              <FloatingInput
                label="New Password"
                secureTextEntry
                value={field.value}
                onChangeText={field.onChange}
              />
            )}
          />
          {errors.password && (
            <Text className="text-red-400">{errors.password.message}</Text>
          )}
        </View>
      )}

      {/* Submit */}
      <View className="absolute bottom-0 w-full px-6 py-4 bg-white border-t shadow-md border-slate-200">
        <Pressable disabled={isPending} onPress={confirmAndSubmit}>
          <Text className="py-4 text-center text-white rounded-md shadow bg-primary-500 font-cereal-regular">
            {isPending ? "Updating..." : "Submit"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
