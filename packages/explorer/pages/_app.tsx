import "./styles.css"
import type { AppProps } from "next/app"
import "../components/firebase/analytics"
import "../components/firebase/auth"
import { useRouter } from 'next/router'
import { logEvent } from "../components/firebase/analytics"
import { UserProvider } from "../components/firebase/user"
import { MyEnvsProvider } from "../components/my-envs/my-envs"
import { btnConfirmationSelectable } from "./btnConfirmationSelectable"


const App = ({ Component, pageProps }: AppProps) => {
  const router = useRouter();

  logEvent('screen_view', {
    firebase_screen: router.pathname,
    firebase_screen_class: Component.name,
  })

  return <btnConfirmationSelectable.Provider>
    <UserProvider>
      <MyEnvsProvider>
        <Component {...pageProps} />
      </MyEnvsProvider>
    </UserProvider>
  </btnConfirmationSelectable.Provider>
}

export default App;
