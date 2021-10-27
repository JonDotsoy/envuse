import classNames from "classnames";
import { FC } from "react";
import { SpinIcon } from "./core/SpinIcon";

export const SpinLoading: FC<{ loading?: boolean, className?: string }> = ({ loading, children, className }) => {
  return <div className="relative">
    {loading && <div className="absolute w-full flex justify-center items-center"><SpinIcon /></div>}
    <div
      className={classNames(
        'transition-opacity',
        { "opacity-20": loading },
        className,
      )}
    >
      {children}
    </div>
  </div>;
}