import SignInForm from "@/components/auth/sign-in/SignInForm";
import SignInHeader from "@/components/auth/sign-in/SignInHeader";
import { SafeAreaView } from "react-native-safe-area-context";
// import { StatusBar } from "expo-status-bar";

export default function SignIn() {
  return (
    <SafeAreaView className="flex-1 bg-primary-500">
      {/* <StatusBar backgroundColor="rgb(45 82 210)" /> */}
      <SignInHeader />
      <SignInForm />
    </SafeAreaView>
  );
}
