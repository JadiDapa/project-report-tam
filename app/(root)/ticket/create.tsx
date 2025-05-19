import { StatusBar } from "react-native";
import StackScreenHeader from "@/components/StackScreenHeader";
import { SafeAreaView } from "react-native-safe-area-context";
import CreateTicketForm from "@/components/ticket/CreateTicketForm";

export default function CreateTicket() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar backgroundColor="#2d52d2" />
      <StackScreenHeader title="Your Tickets" />
      <CreateTicketForm />
    </SafeAreaView>
  );
}
