import { useUser } from "@clerk/clerk-expo";
import { Redirect, Slot } from "expo-router";

export default function AppLayout() {
  const { user } = useUser();

  if (!user) {
    return <Redirect href="/auth" />;
  }

  return <Slot />;
}
