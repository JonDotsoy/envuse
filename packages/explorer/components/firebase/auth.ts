import * as firebaseAuth from "firebase/auth";
import { app } from "./app";

const githubProvider = new firebaseAuth.GithubAuthProvider();

export const auth = firebaseAuth.getAuth(app);

type SignInWithRedirectArgs = typeof firebaseAuth.signInWithRedirect extends (
  arg0: any,
  arg1: any,
  ...args: infer R
) => any
  ? R
  : never;

export const github = {
  signInWithRedirect: async (...args: SignInWithRedirectArgs) => {
    const result = await firebaseAuth.getRedirectResult(auth);

    if (!result) {
      await firebaseAuth.signInWithRedirect(auth, githubProvider, ...args);
    }

    return result;
  },
};
