import { createContext, useContext, FC } from "react";
import { isTypeOf } from "../../lib/isTypeOf";
import classnames from 'classnames'

const NavFocusContext = createContext<string | string[] | null>(null)

const useItemFocus = (itemKey?: string) => {
  const selectedValue = useContext(NavFocusContext);
  const selectedFocus = Array.isArray(selectedValue) ? selectedValue : selectedValue ? [selectedValue] : [];

  return itemKey && selectedFocus.includes(itemKey)
}

export const Nav: FC<{ selected?: string | string[] }> & { ItemLi: typeof ItemLi, Item: typeof ItemLi } = ({ children, selected }) => {
  return <NavFocusContext.Provider value={selected ?? null}>
    <nav>
      <ul className="flex flex-row">
        {children}
      </ul>
    </nav>
  </NavFocusContext.Provider>
};

export const ItemLi: FC<{ keyItem?: string, className?: string }> = ({ keyItem, children, className }) => {
  const selected = useItemFocus(keyItem);

  return <li className={classnames("px-4", "text-xl", { "rounded-md": selected }, className)}>{children}</li>
}

export const Item: FC<{ keyItem?: string }> = ({ keyItem, children }) => {
  const selected = useItemFocus(keyItem);

  return <span className={classnames("px-4", "text-xl", { "rounded-md": selected })}>{children}</span>
}

Nav.ItemLi = ItemLi;
Nav.Item = Item;

