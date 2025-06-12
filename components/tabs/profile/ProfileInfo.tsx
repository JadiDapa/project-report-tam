import { View, Text, Image, Pressable } from "react-native";
import {
  Camera,
  Images,
  Mail,
  Pencil,
  Phone,
  User,
  X,
} from "lucide-react-native";
import { AccountType, CreateAccountType } from "@/lib/types/account";
import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
  ActionsheetItem,
  ActionsheetItemText,
} from "@/components/ui/actionsheet";
import { useEffect, useRef, useState } from "react";
import { pickImage, takePhoto } from "@/lib/image-options";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateAccount } from "@/lib/network/account";
import { useCustomToast } from "@/lib/useToast";
import { router } from "expo-router";
import { useAccount } from "@/contexts/AccountContexts";

export default function ProfileInfo({ account }: { account: AccountType }) {
  const [showActionsheet, setShowActionsheet] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState();

  const { showToast } = useCustomToast();
  const queryClient = useQueryClient();
  const { refetch } = useAccount();

  const handleClose = () => setShowActionsheet(false);

  const { mutate: onUpdateReport } = useMutation({
    mutationFn: (values: CreateAccountType) =>
      updateAccount(account.id.toString(), values),
    onSuccess: () => {
      showToast("Success", "Profile Image Updated Successfully");
      queryClient.invalidateQueries({ queryKey: ["accounts", account.email] });
      refetch();
    },

    onError: (err) => {
      console.log("Upload Error", JSON.stringify(err, null, 2));
      showToast("Error", err?.message || "Failed To Update Your Profile Image");
    },
  });

  useEffect(() => {
    if (selectedProfile) {
      const updateReport = async () => {
        await onUpdateReport({
          email: account.email,
          fullname: account.fullname,
          roleId: account.roleId,
          image: selectedProfile,
        });
      };

      updateReport();
      setSelectedProfile(undefined);
    }
  }, [selectedProfile]);

  return (
    <View className="pt-6 bg-white">
      <View className="flex-row items-center gap-4 px-6 mt-4">
        <Pressable
          onPress={() => setShowActionsheet(true)}
          className="relative overflow-hidden rounded-full size-20"
        >
          <Image
            source={{
              uri:
                account.image ||
                "https://st3.depositphotos.com/6672868/13701/v/450/depositphotos_137014128-stock-illustration-user-profile-icon.jpg",
            }}
            className="object-cover object-center w-full h-full"
          />
          <Actionsheet isOpen={showActionsheet} onClose={handleClose}>
            <ActionsheetBackdrop />
            <ActionsheetContent>
              <ActionsheetDragIndicatorWrapper>
                <ActionsheetDragIndicator />
              </ActionsheetDragIndicatorWrapper>
              <View className="relative flex-row items-center justify-center w-full gap-2 mt-4 ">
                <Text className="text-lg font-cereal-medium">
                  Change Profile Picture
                </Text>
              </View>
              <View className="flex-row h-40 gap-6">
                <ActionsheetItem
                  className="flex-col items-center justify-center gap-2 w-30"
                  onPress={() => {
                    takePhoto(setSelectedProfile);
                    handleClose();
                  }}
                >
                  <View className="items-center justify-center p-6 border rounded-full border-slate-300">
                    <Camera size={24} color={"black"} />
                  </View>
                  <ActionsheetItemText className="text-lg font-cereal-medium">
                    Camera
                  </ActionsheetItemText>
                </ActionsheetItem>
                <ActionsheetItem
                  className="flex-col items-center justify-center gap-2 w-30"
                  onPress={() => {
                    pickImage(setSelectedProfile);
                    handleClose();
                  }}
                >
                  <View className="items-center justify-center p-6 border rounded-full border-slate-300">
                    <Images size={24} color={"black"} />
                  </View>
                  <ActionsheetItemText className="text-lg font-cereal-medium">
                    Gallery
                  </ActionsheetItemText>
                </ActionsheetItem>
                <ActionsheetItem
                  className="flex-col items-center justify-center gap-2 w-30"
                  onPress={handleClose}
                >
                  <View className="items-center justify-center p-6 border border-dashed rounded-full border-slate-300">
                    <X size={24} color={"black"} />
                  </View>
                  <ActionsheetItemText className="text-lg font-cereal-medium">
                    Cancel
                  </ActionsheetItemText>
                </ActionsheetItem>
              </View>
            </ActionsheetContent>
          </Actionsheet>
        </Pressable>
        <View className="gap-1">
          <Pressable
            onPress={() => router.push(`/profile/edit/[${account.id}]`)}
            className="flex-row items-center gap-2"
          >
            <Text className="text-2xl font-cereal-medium">
              {account.fullname}
            </Text>
            <Pencil size={16} color={"#555"} />
          </Pressable>

          <View className="flex-row items-center self-start gap-2 px-3 py-1 rounded-lg bg-primary-100">
            <User size={14} strokeWidth={2} color={"blue"} />
            <Text className="text-sm capitalize text-primary-500 font-cereal-medium">
              {account.Role.name}
            </Text>
          </View>
        </View>
      </View>
      <View className="gap-2 px-6 mt-6">
        <View className="flex-row items-center gap-3 px-3 py-1 rounded-lg">
          <Phone size={16} color={"#555"} />
          <Text className="text-slate-600 font-cereal-medium">
            {"+62" + account.phoneNumber || "No Phone Number Provided"}
          </Text>
        </View>
        <View className="flex-row items-center gap-3 px-3 py-1 rounded-lg">
          <Mail size={16} color={"#555"} />
          <Text className="text-slate-600 font-cereal-medium">
            {account.email}
          </Text>
        </View>
      </View>
      <View className="flex-row mt-6 ">
        <View className="items-center justify-center flex-1 py-4 border-r border-y border-slate-300">
          <Text className="text-xl font-cereal-medium text-primary-500">
            {account.Projects?.length}
          </Text>
          <Text className="font-cereal-medium">Projects</Text>
        </View>
        <View className="items-center justify-center flex-1 py-3 border-y border-slate-300">
          <Text className="text-xl font-cereal-medium text-primary-500">
            {account.Reports?.length}
          </Text>
          <Text className="font-cereal-medium">Reports</Text>
        </View>
      </View>
    </View>
  );
}
