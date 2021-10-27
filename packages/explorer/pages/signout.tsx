import { useRouter } from "next/router";
import { FC, useEffect } from "react";
import { auth } from "../components/firebase/auth";
import { useUser } from "../components/firebase/user";

const SignOut: FC = () => {
  const router = useRouter();
  const { signOut } = useUser();

  useEffect(() => {
    signOut().then(() => {
      router.push("/");
    });
  }, []);

  return <>
    Loading...
  </>
}

export default SignOut;
