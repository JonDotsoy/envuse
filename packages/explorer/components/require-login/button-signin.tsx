import Link from 'next/link';
import { useRouter } from 'next/router';
import { FC } from "react";

export const ButtonSignin: FC = () => {
  const router = useRouter();
  // createElement(Fragment, null, "Please ", createElement(link, { href: { pathname: "/signin", query: { callback: router.asPath } } }, createElement("a", null, "login")), " to view this page.")
  return <>
    <div className="px-4 container">
      Please <Link href="/signin" as={`/signin?redirect=${router.asPath}`}><a className="underline text-blue-500 hover:text-blue-600">login</a></Link> to view this page.
    </div>
  </>
}