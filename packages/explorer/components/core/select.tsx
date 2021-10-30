import React, { createContext, FC, HTMLAttributes, ReactNode, SelectHTMLAttributes, useContext, useEffect, useMemo, useRef, useState } from "react";
import { Store } from "../../lib/store";
import classNames from 'classnames'
import { XCircleSolid } from "../theme/icons/solid/x-circle";

const storeSelectExpanded = new Store<string | null>(null);

interface Props extends SelectHTMLAttributes<HTMLSelectElement> {
}

const toType = (val: any) => typeof val === 'object' && val !== null
  && 'type' in val
  ? val.type
  : null;

const toProp = (val: any) => typeof val === 'object' && val !== null
  && 'props' in val
  && typeof val.props === 'object' && val.props !== null
  ? val.props
  : null;

const toChildren = (val: any) => toProp(val) !== null && 'children' in val.props
  ? val.props.children
  : null;

const toValue = (val: any) => {
  const type = toType(val);
  const children = toChildren(val);
  if (type === 'option' && typeof children === 'string') return children;
  const prop = toProp(val);
  if (prop !== null && 'value' in val.props) return val.props.value;
  if (prop !== null && 'x-value' in val.props) return val.props['x-value'];
  return null;
}

let n = 0;

interface SelectOption {
  onSelect: (value: any) => void
}

const selectContext = createContext<SelectOption>({ onSelect: () => { } });

const SelectProvider: FC<{ onSelect: (value: any) => void }> = ({ onSelect, children }) => {
  return (
    <selectContext.Provider value={{ onSelect }}>
      {children}
    </selectContext.Provider>
  );
}

export const AreaSelectable: FC<HTMLAttributes<HTMLDivElement> & { value: any }> = ({ children, value, ...props }) => {
  const selectCtx = useContext(selectContext);

  const cbSelect = () => {
    selectCtx.onSelect(value);
  }

  return (
    <div {...props} onClick={cbSelect}>
      {children}
    </div>
  )
}

export const Select: FC<Props> = ({ className, children, defaultValue }) => {
  const divRef = useRef<HTMLSpanElement>(null);
  const [value, setValue] = useState<any>(defaultValue ?? null);
  const selectId = useMemo(() => `select-${n++}`, []);
  const [expand, setExpand] = storeSelectExpanded.useHook(v => v === selectId);

  const expandSelect = () => setExpand(!expand ? selectId : null);
  const cancelExpand = () => setExpand(null);

  useEffect(() => {
    const eventCancelExpand = (event: MouseEvent) => {
      cancelExpand();
    }
    window.addEventListener('click', eventCancelExpand);
    return () => window.addEventListener('click', eventCancelExpand);
  }, []);

  const selectValue = (value: any) => {
    setValue(value);
    setExpand(null);
  }

  const cleanValue = () => {
    setValue(null);
  }

  return <span ref={divRef} className="relative" onClick={event => event.stopPropagation()}>
    <div className={classNames(className, 'flex justify-center items-center')} style={{ minWidth: 150 }} onClick={expandSelect}>
      <span className="flex-1">{value ?? <span className="text-gray-400">Not specified</span>}</span>
      {
        value &&
        <XCircleSolid className="opacity-25" onClick={event => { event.stopPropagation(); cleanValue() }} />
      }
    </div>
    <div
      className={classNames(
        "absolute bg-white left-0 z-10 shadow-md",
        { 'hidden': !expand },
      )}
      style={{
        minWidth: 250,
      }}
    >
      <SelectProvider onSelect={selectValue}>
        {children}
      </SelectProvider>
    </div>
  </span >
}
