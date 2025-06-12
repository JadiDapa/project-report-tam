import { userIcon, mailIcon, lockIcon } from "@/constants/Images";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  View,
  TextInput,
  Pressable,
  Text,
  Image,
  Button,
  Linking,
} from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { useSignUp } from "@clerk/clerk-expo";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createAccount } from "@/lib/network/account";
import { AccountType, CreateAccountType } from "@/lib/types/account";
import { useCustomToast } from "@/lib/useToast";

export default function SignUpForm() {
  const [fullname, setFullname] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { showToast } = useCustomToast();

  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { mutate: onCreateUser } = useMutation({
    mutationFn: (values: CreateAccountType) => createAccount(values),
  });

  const handleWhatsAppRequest = () => {
    if (!fullname || !emailAddress) {
      showToast("Missing Info", "Please enter both full name and email");
      return;
    }
    const phone = "6289523927152";
    const message = `Hello Account Manager,
  
  I would like to request an account. Here are my details:
  Full Name: ${fullname}
  Email: ${emailAddress}
  
  Thank you!`;

    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    Linking.openURL(url);
  };

  const handleEmailRequest = () => {
    if (!fullname || !emailAddress) {
      showToast("Missing Info", "Please enter both full name and email");
      return;
    }

    const to = "accountmanager@example.com"; // <-- replace with your account manager's email
    const subject = "Account Request";
    const body = `Hello Account Manager,
  
  I would like to request an account. Here are my details:
  
  Full Name: ${fullname}
  Email: ${emailAddress}
  
  Thank you!`;

    const mailtoURL = `mailto:${to}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;

    Linking.openURL(mailtoURL);
  };

  // const handleSignUp = async () => {
  //   setLoading(true);
  //   if (!isLoaded) return;

  //   try {
  //     await onCreateUser({
  //       fullname,
  //       email: emailAddress,
  //       roleId: 1,
  //     });
  //     queryClient.invalidateQueries({ queryKey: ["accounts"] });
  //     const signUpAttempt = await signUp.create({
  //       emailAddress,
  //       password,
  //     });
  //     if (signUpAttempt.status === "complete") {
  //       await setActive({ session: signUpAttempt.createdSessionId });
  //       showToast("Success", "Your Account Successfully Signed Up");
  //       router.push("/");
  //     } else {
  //       showToast("Error!", "Failed to Sign Your Account");
  //     }
  //   } catch (err) {
  //     console.error(JSON.stringify(err, null, 2));
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  return (
    <View className="flex-1 p-9 pt-12 mt-6 bg-white rounded-t-[28px]">
      <View className="w-full ">
        <Text className="pt-1 text-5xl text-primary-500 font-cereal-medium">
          Register
        </Text>
        <Text className="mt-1 text-primary-500 font-cereal-medium">
          Please Sign Up to Login
        </Text>
      </View>
      <View className="gap-4 mt-6">
        <View className="relative flex flex-row gap-4 overflow-hidden rounded-full h-14 bg-primary-500/10 ">
          <Image
            source={userIcon}
            className="absolute -translate-y-1/2 size-6 left-6 top-1/2"
          />
          <TextInput
            placeholder="Full Name"
            onChangeText={(value) => setFullname(value)}
            className="w-full h-full text-lg font-cereal ps-16"
          />
        </View>
        <View className="relative flex flex-row gap-4 overflow-hidden rounded-full h-14 bg-primary-500/10 ">
          <Image
            source={mailIcon}
            className="absolute -translate-y-1/2 size-6 left-6 top-1/2"
          />
          <TextInput
            placeholder="Email"
            onChangeText={(value) => setEmailAddress(value)}
            className="w-full h-full text-lg font-cereal ps-16"
          />
        </View>
        {/* <View className="flex flex-row gap-4 overflow-hidden rounded-full h-14 bg-primary-500/10 ">
          <Image
            source={lockIcon}
            className="absolute -translate-y-1/2 size-6 left-6 top-1/2"
          />
          <TextInput
            placeholder="Password"
            onChangeText={(value) => setPassword(value)}
            secureTextEntry={showPassword ? false : true}
            className="w-full h-full text-lg font-cereal ps-16"
          />
          <Pressable
            onPress={() => setShowPassword(!showPassword)}
            className="absolute -translate-y-1/2 size-6 right-6 top-1/2"
          >
            <Feather
              name={showPassword ? "eye-off" : "eye"}
              size={18}
              color="black"
            />
          </Pressable>
        </View> */}
      </View>

      <View>
        {/* <Pressable
          onPress={handleSignUp}
          disabled={loading}
          className={`flex flex-row justify-center gap-2 p-4 mt-6 rounded-full bg-primary-500 ${
            loading ? "opacity-50" : ""
          }`}
        >
          <Text className="text-xl text-white font-cereal-medium">
            {loading ? "Signing Up..." : "Sign Up"}
          </Text>
        </Pressable> */}

        <View className="flex flex-row items-center gap-2 mt-4">
          <Pressable
            onPress={handleWhatsAppRequest}
            className="flex-1 px-4 py-2 bg-green-500 rounded-full"
          >
            <Text className="text-lg text-center text-white font-cereal-medium">
              Request By WA
            </Text>
          </Pressable>
          <Pressable
            onPress={handleEmailRequest}
            className="flex-1 px-4 py-2 rounded-full bg-primary-500"
          >
            <Text className="text-lg text-center text-white font-cereal-medium">
              Request By EM
            </Text>
          </Pressable>
        </View>

        <View className="flex flex-row items-center justify-center mt-4">
          <Text className=" text-slate-600 font-cereal">
            Already have account?{" "}
          </Text>
          <Pressable onPress={() => router.push("/sign-in")}>
            <Text className=" text-primary-500 font-cereal-bold">Sign In</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
