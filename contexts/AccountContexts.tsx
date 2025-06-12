import { createContext, useContext, ReactNode } from "react";
import { useUser } from "@clerk/clerk-expo";
import { getAccountByEmail } from "@/lib/network/account";
import { AccountType } from "@/lib/types/account";
import { Redirect } from "expo-router";

interface AccountContextType {
  account?: AccountType | null;
  loading: boolean;
  refetch: () => void;
}
const AccountContext = createContext<AccountContextType | null>(null);

import { useQuery } from "@tanstack/react-query";

export function AccountProvider({ children }: { children: ReactNode }) {
  const { user, isLoaded } = useUser();
  const userEmail = user?.primaryEmailAddress?.emailAddress || "";

  const {
    data: account,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["account", userEmail],
    queryFn: () => getAccountByEmail(userEmail),
    enabled: !!userEmail,
  });

  if (!isLoaded) return null;
  if (!user) return <Redirect href="/auth" />;

  return (
    <AccountContext.Provider value={{ account, loading: isLoading, refetch }}>
      {children}
    </AccountContext.Provider>
  );
}

export function useAccount(): AccountContextType {
  const context = useContext(AccountContext);
  if (!context) {
    throw new Error("useAccount must be used within an AccountProvider");
  }
  return context;
}
