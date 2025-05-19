import { SafeAreaView, StatusBar } from "react-native";
import React from "react";
import EditAccountProfileHeader from "@/components/profile/EditAccountProfileHeader";
import EditAccountForm from "@/components/profile/EditAccountForm";

export default function EditAccountProfile() {
  return (
    <SafeAreaView>
      <StatusBar />
      <EditAccountProfileHeader />
      <EditAccountForm />
    </SafeAreaView>
  );
}
