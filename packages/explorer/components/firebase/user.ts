import { User } from "firebase/auth";
import { useEffect, useState } from "react";
import { createDynamicHook } from "../create-dynamic-hook";
import { auth, github } from "./auth";

const useUserHook = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });
  }, []);

  return {
    loading,
    loggedIn: loading ? null : !!user,
    user,
    signOut: () => auth.signOut(),
    signInWithGithub: github.signInWithRedirect,
  };
};

const hook = createDynamicHook(useUserHook);

export const useUser = hook.useHook;
export const UserProvider = hook.Provider;
