import "@/global.css";
import { useFonts } from "expo-font";
import { SplashScreen, Slot } from "expo-router";
import { useEffect } from "react";
import GlobalProvider from "@/lib/global-provider";

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    "AirbnbCereal-Light": require("../assets/fonts/AirbnbCereal_Light.otf"),
    "AirbnbCereal-Regular": require("../assets/fonts/AirbnbCereal_Regular.otf"),
    "AirbnbCereal-Medium": require("../assets/fonts/AirbnbCereal_Medium.otf"),
    "AirbnbCereal-Bold": require("../assets/fonts/AirbnbCereal_Bold.otf"),
    "AirbnbCereal-ExtraBold": require("../assets/fonts/AirbnbCereal_ExtraBold.otf"),
    "AirbnbCereal-Black": require("../assets/fonts/AirbnbCereal_Black.otf"),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);



  if (!fontsLoaded) {
    return null;
  }

  return (
    <GlobalProvider>
      <Slot />
    </GlobalProvider>
  );
}
