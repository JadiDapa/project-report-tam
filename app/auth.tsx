import { Image, SafeAreaView } from "react-native";
import { circle } from "@/constants/Images";
import AuthCarousel from "@/components/auth/AuthCarousel";
import AuthActions from "@/components/auth/AuthActions";
import { useAuth } from "@clerk/clerk-expo";
import { Redirect } from "expo-router";

export default function LandingScreen() {
  const { isSignedIn } = useAuth();

  if (isSignedIn) {
    return <Redirect href={"/"} />;
  }

  return (
    <SafeAreaView className="relative flex justify-end flex-1 px-4 py-6 bg-primary-400">
      <Image
        source={circle}
        className="absolute -translate-y-1/2 top-1/2 left-4 size-96"
      />
      <AuthCarousel />
      <AuthActions />
    </SafeAreaView>
  );
}
4;
