import { SafeAreaView, StatusBar } from "react-native";
import React from "react";
import EditAccountProfileHeader from "@/components/profile/EditAccountProfileHeader";
import EditAccountForm from "@/components/profile/EditAccountForm";
import TabScreenHeader from "@/components/tabs/TabScreenHeader";

export default function EditAccountProfile() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar backgroundColor="#2d52d2" />
      <TabScreenHeader title="Edit Account Profile" />
      <EditAccountForm />
    </SafeAreaView>
  );
}
