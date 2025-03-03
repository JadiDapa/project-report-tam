import { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ClerkProvider, ClerkLoaded } from "@clerk/clerk-expo";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { tokenCache } from "@/cache";

interface Props {
  children: ReactNode;
}

export default function Providers({ children }: Props) {
  const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

  if (!publishableKey) {
    throw new Error("Add EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY to your .env file");
  }

  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <ClerkProvider tokenCache={tokenCache} publishableKey={publishableKey}>
        <ClerkLoaded>
          <GluestackUIProvider mode="light">{children}</GluestackUIProvider>
        </ClerkLoaded>
      </ClerkProvider>
    </QueryClientProvider>
  );
}
