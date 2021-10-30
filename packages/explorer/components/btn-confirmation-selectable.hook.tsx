import { useState } from "react";
import { createDynamicHook } from './create-dynamic-hook';


export const btnConfirmationSelectableHook = createDynamicHook(
  () => {
    const [selected, setSelected] = useState<string | null>(null);

    return {
      selected,
      setSelected,
    };
  }
);
