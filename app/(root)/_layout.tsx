import { AccountProvider } from "@/contexts/AccountContexts";
import { Slot } from "expo-router";

export default function AppLayout() {
  return (
    <AccountProvider>
      <Slot />
    </AccountProvider>
  );
}
