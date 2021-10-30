import { createContext } from "react";
import { ValuesForm } from "../types/values-form";

export const formsCtx = createContext<{
  values: ValuesForm;
  updateValue: (key: string, value: any) => void;
}>({ values: {}, updateValue: () => {} });
