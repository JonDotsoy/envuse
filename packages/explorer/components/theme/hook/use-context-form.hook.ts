import { useContext } from "react";
import { formsCtx } from "../context/form.context";

export const useContextForm = () => useContext(formsCtx);
