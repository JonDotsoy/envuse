/**
 * TODO: change by @jondotsoy/create-dynamic-hooks
 */

import { createElement as e, createContext, FC, useContext } from "react";

interface Hook<T> {
  (): T;
}

interface InstanceHook<T, A extends any[], R> {
  (responseHook: T, ...args: A): R;
}

function noInst<T, A extends any[], R = T>(responseHook: T, ...args: A) {
  return responseHook as unknown as R;
}

export const createDynamicHook = <T, A extends any[], R = T>(
  o: Hook<T> | { hook: Hook<T>; inst?: InstanceHook<T, A, R> },
  inst?: InstanceHook<T, A, R>
) => {
  const hook = typeof o === "function" ? o : o.hook;
  const hookInstance =
    inst ?? typeof o === "function" ? noInst : o.inst ?? noInst;

  const ctx = createContext<T | null>(null);
  const Provider: FC<{ value?: T }> = ({ value, children }) =>
    e(ctx.Provider, { value: value ?? hook() }, children);
  const getContext = () => useContext(ctx);
  const useHook = (...args: A) => hookInstance(getContext() ?? hook(), ...args);

  return {
    getContext,
    Provider,
    useHook,
  };
};
