import { useRouter } from "next/router";
import { FC, useEffect } from "react"
import { useUser } from "../components/firebase/user";

const SignIn: FC = () => {
  const router = useRouter()
  const { signInWithGithub: signInWithRedirectWithGithub } = useUser()

  useEffect(() => {
    const queryRedirect = router.query.redirect;
    if (typeof queryRedirect === "string") {
      globalThis.localStorage.setItem("redirect_ok_signin", queryRedirect)
    }

    signInWithRedirectWithGithub()
      .then(() => {
        const queryRedirect = globalThis.localStorage.getItem("redirect_ok_signin");
        
        if (queryRedirect) {
          globalThis.localStorage.removeItem("redirect_ok_signin");
          router.push(queryRedirect);
        } else {
          router.push("/");
        }
      });
  }, []);

  return <>
    Loading...
  </>
}

export default SignIn
