import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useUser } from "@clerk/clerk-expo";
import { getAccountByEmail } from "@/lib/network/account";
import { AccountType } from "@/lib/types/account";
import { Redirect } from "expo-router";

interface AccountContextType {
  account: AccountType | null;
  loading: boolean;
}

const AccountContext = createContext<AccountContextType | null>(null);

export function AccountProvider({ children }: { children: ReactNode }) {
  const { user, isLoaded } = useUser();
  const userEmail = user?.primaryEmailAddress?.emailAddress || "";
  const [account, setAccount] = useState<AccountType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userEmail) {
      getAccountByEmail(userEmail).then((data) => {
        setAccount(data);
        setLoading(false);
      });
    }
  }, [userEmail]);

  if (!isLoaded) return null;
  if (!user) return <Redirect href="/auth" />;

  return (
    <AccountContext.Provider value={{ account, loading }}>
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
