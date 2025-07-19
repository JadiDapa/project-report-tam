import "@/global.css";
import { useFonts } from "expo-font";
import { SplashScreen, Slot } from "expo-router";
import { useEffect } from "react";
import GlobalProvider from "@/lib/global-provider";
import * as Updates from "expo-updates";

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

  // ✅ Auto update check on startup
  useEffect(() => {
    const checkAndUpdate = async () => {
      try {
        const update = await Updates.checkForUpdateAsync();
        if (update.isAvailable) {
          await Updates.fetchUpdateAsync();
          await Updates.reloadAsync(); // App will reload with the new update
        }
      } catch (e) {
        console.log("Expo update check failed:", e);
      }
    };

    checkAndUpdate();
  }, []);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <GlobalProvider>
      <Slot />
    </GlobalProvider>
  );
}
