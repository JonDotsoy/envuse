import React, { ChangeEvent, FC } from "react";
import { Select } from "../core/select";
import { useContextForm } from "./hook/use-context-form.hook";

type TypeInput = 'select' | 'input'

type NewType = {
  name: string | string[];
  label?: string;
  type?: TypeInput;
  onChange?: (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  className?: string;
};

export const Input: FC<NewType> = ({ name, label, type: typeIn, className, onChange: onChangeIn, children }) => {
  const type = typeIn || 'input';
  const { updateValue, values } = useContextForm();
  const nameStr = Array.isArray(name) ? name.join('.') : name;

  const change = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (onChangeIn) {
      return onChangeIn(event);
    }
    updateValue(nameStr, event.currentTarget.value)
  }

  return <div className={className}>
    {label &&
      <label className="text-lg flex-shrink-0">{label}</label>
    }
    {type === 'input' &&
      <input
        name={nameStr}
        onChange={change}
        type="text"
        className="border border-gray-300 w-full p-2 focus:border-gray-500 focus:shadow-md"
        defaultValue={values[nameStr]}
      />
    }
    {type === 'select' &&
      <Select
        // name={nameStr}
        // onChange={change}
        className="border border-gray-300 w-full p-2 focus:border-gray-500 focus:shadow-md"
        defaultValue={values[nameStr]}
      >
        {children}
      </Select>
    }
  </div>
}
