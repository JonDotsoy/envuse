import { FC, useMemo } from "react";
import { formsCtx } from "./context/form.context";
import { ValuesForm } from "./types/values-form";

type NewType = {
  initialValue?: ValuesForm;
  form?: {
    values?: ValuesForm;
  };
};

export const Form: FC<NewType> = ({ children, initialValue, form }) => {
  const values = initialValue ?? {};

  if (form) {
    form.values = initialValue;
  }

  const updateValue = (key: string, value: any) => {
    values[key] = value;
  };

  return <formsCtx.Provider value={{ values, updateValue }}>{children}</formsCtx.Provider>;
};


export const useForm = (): { values?: ValuesForm } => useMemo(() => ({}), []);
