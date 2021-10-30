import { FC, useEffect, useState } from "react";
import classNames from 'classnames';
import { SpinIcon } from '../core/SpinIcon';
import { ButtonOptions } from "./types/button-options";
import { usePositionGroupButton } from "./context/use-position-group-button";

export const Button: FC<ButtonOptions> = ({ children, onChangeLoading, size: sizeIn, typeStyle, disabled: disabledIn, loading: loadingIn, className, onClick, ...others }) => {
  const [secureClickLoading, setSecureClickLoading] = useState(false);

  const size = sizeIn ?? 'medium';
  const typeStyleValue = typeStyle ?? 'default';
  const position = usePositionGroupButton();
  const disabled = secureClickLoading || (disabledIn ?? false);
  const loading = secureClickLoading || (loadingIn ?? false);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (onClick) {
      setSecureClickLoading(true);
      onChangeLoading?.(true);
      Promise.resolve(onClick(e))
        .finally(() => {
          setSecureClickLoading(false);
          onChangeLoading?.(false);
        });
    }
  }

  return <button
    {...others}
    onClick={handleClick}
    disabled={disabled}
    className={classNames(
      "inline-flex flex-shrink-0 justify-center items-center transition-all",
      'border border-separate',
      {
        'hover:shadow-md focus:shadow-md': !disabled,
        "cursor-default": disabled,
      },

      size === 'small' && 'py-1 px-3 text-sm',
      size === 'medium' && 'py-2 px-6',

      typeStyleValue === 'default' && {
        "border-gary-500 text-gray-500": !disabled,
        "hover:border-blue-400 hover:text-blue-400": !disabled,
        "focus:border-blue-400 focus:text-blue-400": !disabled,
        "bg-gray-100 border-gray-200 text-gray-300": disabled,
      },
      typeStyleValue === 'primary' && {
        "border-blue-400 bg-blue-400 text-white": !disabled,
        "hover:border-blue-500 hover:bg-blue-500": !disabled,
        "focus:border-blue-500 focus:bg-blue-500": !disabled,
        "bg-blue-100 border-blue-100 text-gray-100": disabled,
      },

      !position?.isMiddle && 'rounded',
      position?.isFirst && 'rounded-r-none',
      position?.isLast && 'rounded-l-none',
      className,
    )}
  >
    {loading && <span><SpinIcon /></span>}
    {children}
  </button >
}


