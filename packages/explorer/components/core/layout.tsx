import React, { FC } from "react";
import Link from "next/link";
import { EnvuseBrand } from "../brand/envuse-brand";
import { useUser } from "../firebase/user";
import classNames from "classnames";
import { SpinIcon } from "./SpinIcon";
import { LogoutIcon } from "./LogoutIcon";

const ButtonDefaultClassName = classNames(
  'inline-flex',
  'items-center',
  `border`,
  `border-blue-400`,
  `rounded-full`,
  `px-7`,
  `py-2`,
  'text-blue-400',
  'hover:border-blue-400 transition-all hover:shadow-md hover:text-blue-500',
)

const ButtonPrincipalClassName = classNames(
  'inline-flex',
  'items-center',
  `border`,
  `border-blue-400`,
  `rounded-full`,
  `px-7`,
  `py-2`,
  'bg-blue-400',
  'text-white',
  'hover:bg-blue-500 transition-all hover:shadow-md',
)



export const ButtonUser: FC<{ className?: string, href?: string }> = ({ className, children, href }) => {
  const { loading, loggedIn, user, signOut } = useUser()

  if (loading) return <a className={className}><SpinIcon /> Cargando...</a>
  if (!loggedIn) return <Link href="/signin"><a className={className}>Iniciar sesión</a></Link>

  const btnMe = href
    ? <Link href={href}>
      <a className={className}>{children}</a>
    </Link>
    : <a className={className}>{children}</a>

  return <>
    {btnMe}
    <button className={classNames(className, 'flex flex-shrink-0 justify-end items-center')} onClick={signOut}>Salir <LogoutIcon /></button>
  </>
}


export const Layout: FC = ({ children }) => {
  const { user } = useUser()

  return <>
    <div className="container mx-auto pt-4">
      <div className="flex flex-col items-center">
        <div className="flex-grow mb-4">
          <EnvuseBrand size="@90w"></EnvuseBrand>
        </div>
        <div className="flex flex-col space-y-2 w-full px-4">
          <Link href="/"><a className={classNames(ButtonDefaultClassName)}>Overview</a></Link>
          <Link href="/playground"><a className={ButtonDefaultClassName}>Playground</a></Link>
          <ButtonUser className={classNames(ButtonPrincipalClassName)} href="/my-envs">{user?.displayName ? <>{user.displayName} | Mis Envs</> : <>Mis Envs</>}</ButtonUser>
        </div>
      </div>

      <div className="pt-5">
        {children}
      </div>

    </div>
  </>;
}
