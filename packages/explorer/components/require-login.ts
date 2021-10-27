import { createElement as e, FC, Fragment } from "react";
import { useUser } from "./firebase/user";
import { ButtonSignin } from "./require-login/button-signin";

export const RequireLogin: FC = ({ children }) => {
  const { loading, loggedIn } = useUser();

  if (loading)
    return e(
      Fragment,
      null,
      e("div", { className: "px-4 container" }, "Loading...")
    );
  if (!loggedIn) return e(ButtonSignin);

  return e(Fragment, null, children);
};
