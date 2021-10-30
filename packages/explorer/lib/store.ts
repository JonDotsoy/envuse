import { useEffect, useState } from "react";

export class Store<T> {
  #subs: Function[] = [];
  #state: T;

  constructor(initialState: T) {
    this.#state = initialState;
  }

  subscribe = (sub: Function) => {
    this.#subs.push(sub);
    return () => {
      this.#subs = this.#subs.filter((s) => s !== sub);
    };
  };

  setState = (state: T) => {
    this.#state = state;
    this.#subs.forEach((s) => s(state));
  };

  getState = () => this.#state;

  useHook = <R = T>(transform: (v: T) => R) => {
    const [value, setValue] = useState<R>(transform(this.getState()));

    useEffect(() => {
      const sub = this.subscribe(() => {
        setValue(transform(this.getState()));
      });
      return () => sub();
    }, []);

    const wrapSetValue = (newVal: T) => {
      this.setState(newVal);
    };

    return [value, wrapSetValue] as const;
  };
}
