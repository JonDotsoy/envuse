import React, { FC } from "react";
import classNames from 'classnames';

export const Container: FC<{ className?: string; }> = ({ children, className }) => {
  return <div className={classNames('container', className)}>
    {children}
  </div>;
};
