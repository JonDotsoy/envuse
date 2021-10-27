import React, { FC, useMemo, useState } from "react";
import classNames from 'classnames';
import { buttonConfirmationGlobalStore } from "./buttonConfirmationGlobalStore";
import { Button } from "./button";
import { GroupButton } from "./GroupButton";
import { ButtonOptions } from "./button-options";

let n = 0;

export const ButtonConfirmation: FC<Pick<ButtonOptions, 'size' | 'onClick' | 'typeStyle' | 'loading'>> = ({ loading: loadingIn, typeStyle, size, children, onClick }) => {
  const [loadingStore, setLoading] = useState(false);
  const id = useMemo(() => `btn-selectable-${n++}`, []);
  const { selected, setSelected } = buttonConfirmationGlobalStore.useHook(id);

  const loading = loadingIn || loadingStore;

  const inConfirmation = selected === id;
  const openConfirmation = () => !loading && setSelected(id);
  const closeConfirmation = () => setSelected(null);

  const onSuccessConfirm = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    closeConfirmation();
    await onClick?.(e);
    setLoading(false);
  };

  return <>
    <Button
      typeStyle={typeStyle}
      size={size}
      disabled={inConfirmation || loading}
      loading={loading}
      onClick={openConfirmation}
    >
      {children}
    </Button>

    {inConfirmation &&
      <GroupButton>
        <Button size={size} className={classNames("transition-all ml-1 border rounded-l border-separate py-1 px-3 text-sm border-gary-500 text-gray-500 hover:border-blue-400 hover:text-blue-400")} onClick={closeConfirmation}>Cancelar</Button>
        <Button
          size={size}
          onClick={onSuccessConfirm}
          typeStyle="primary"
          onChangeLoading={setLoading}
        >
          Confirmar
        </Button>
      </GroupButton>}
  </>;
};
