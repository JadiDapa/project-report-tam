import { KeyboardAvoidingView, Platform } from "react-native";

import SignUpHeader from "@/components/auth/sign-up/SignUpHeader";
import SignUpForm from "@/components/auth/sign-up/SignUpForm";

export default function SignUp() {
  return (
    <KeyboardAvoidingView
      className="flex-1 bg-primary-500 h-96"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={100}
    >
      {/* <StatusBar backgroundColor="rgb(45 82 210)" /> */}

      <SignUpHeader />
      <SignUpForm />
    </KeyboardAvoidingView>
  );
}
