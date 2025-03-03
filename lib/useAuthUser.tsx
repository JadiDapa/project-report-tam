import { auth } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth"; // Import User type
import { useEffect, useState } from "react";

export default function useAuthUser() {
  const [user, setUser] = useState<User | null>(null); // Explicitly define type

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser); // No error now
    });

    return () => unsubscribe(); // Clean up the listener
  }, []);

  return user;
}
