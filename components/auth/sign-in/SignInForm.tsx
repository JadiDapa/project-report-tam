import { View, Text, Image, Pressable, Switch, TextInput } from "react-native";
import React, { useState } from "react";
import { mailIcon, lockIcon, eyeClosedIcon } from "@/constants/Images";
import { router } from "expo-router";
import { useSignIn } from "@clerk/clerk-expo";

export default function SignInForm() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSignIn() {
    if (!isLoaded) return;

    setLoading(true);

    try {
      const result = await signIn.create({
        identifier: email,
        password: password,
      });

      await setActive({ session: result.createdSessionId });
      router.push("/");
    } catch (e) {
      console.error(JSON.stringify(e, null, 2));
    } finally {
      setLoading(false);
    }
  }

  return (
    <View className="flex-1 p-9 pt-12 mt-6 bg-white rounded-t-[28px]">
      <View className="w-full ">
        <Text className="pt-1 text-5xl text-primary-500 font-cereal-medium">
          Login
        </Text>
        <Text className="mt-1 text-primary-500 font-cereal-medium">
          Please Sign In to Continue
        </Text>
      </View>
      <View className="gap-4 mt-6">
        <View className="relative flex flex-row gap-4 overflow-hidden rounded-full h-14 bg-primary-500/10 ">
          <Image
            source={mailIcon}
            className="absolute -translate-y-1/2 size-6 left-6 top-1/2"
          />
          <TextInput
            placeholder="Email"
            onChangeText={(value) => setEmail(value)}
            className="w-full h-full text-lg font-cereal ps-16"
          />
        </View>
        <View className="flex flex-row gap-4 overflow-hidden rounded-full h-14 bg-primary-500/10 ">
          <Image
            source={lockIcon}
            className="absolute -translate-y-1/2 size-6 left-6 top-1/2"
          />
          <TextInput
            placeholder="Password"
            onChangeText={(value) => setPassword(value)}
            secureTextEntry={true}
            className="w-full h-full text-lg font-cereal ps-16"
          />
          <Image
            source={eyeClosedIcon}
            className="absolute -translate-y-1/2 size-6 right-6 top-1/2"
          />
        </View>
        <View className="flex-row items-center justify-between ">
          <Text className="pl-4 text-primary-500 font-cereal-medium">
            Remind Me Later
          </Text>
          <Switch className="h-10 " />
        </View>
      </View>
      <View>
        <Pressable
          onPress={handleSignIn}
          className="flex flex-row justify-center gap-2 p-4 mt-6 rounded-full bg-primary-500"
        >
          <Text className="text-xl text-white font-cereal-medium">
            {loading ? "Signing In..." : "Sign In"}
          </Text>
        </Pressable>

        <View className="flex flex-row items-center justify-center mt-4">
          <Text className=" text-slate-600 font-cereal">
            Dont have account?{" "}
          </Text>
          <Pressable onPress={() => router.push("/sign-up")}>
            <Text className=" text-primary-500 font-cereal-bold">Sign Up</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
