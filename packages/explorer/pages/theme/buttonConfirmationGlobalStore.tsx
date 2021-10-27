import { useEffect, useState } from "react";

export const buttonConfirmationGlobalStore = new class {
  subs: Function[] = [];
  state: string | null = null;
  subscribe = (sub: Function) => {
    this.subs.push(sub);
    return () => {
      this.subs = this.subs.filter(s => s !== sub);
    };
  };
  setState = (state: string | null) => {
    this.state = state;
    this.subs.forEach(s => s(state));
  };
  getState = () => this.state;
  useHook = (id?: string) => {
    const [selected, setSelected] = useState<null | string>(this.getState());

    useEffect(() => {
      const sub = this.subscribe(() => {
        if (id) {
          if (this.getState() === id) {
            setSelected(this.getState());
          } else {
            setSelected(null);
          }
        } else {
          setSelected(this.getState());
        }
      });
      return () => sub();
    }, []);

    const wrapSetSelected = (newVal: string | null) => {
      this.setState(newVal);
    };

    return {
      selected,
      setSelected: wrapSetSelected,
    };
  };
};
