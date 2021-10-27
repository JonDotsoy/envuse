import { useState } from "react";
import { createDynamicHook } from '../components/create-dynamic-hook';

export const btnConfirmationSelectable = createDynamicHook(
  () => {
    const [selected, setSelected] = useState<string | null>(null);

    return {
      selected,
      setSelected,
    };
  }
);
