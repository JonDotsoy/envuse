import { FC } from "react";
import { GroupButtonContext } from "./GroupButtonContext";


export const GroupButton: FC = ({ children }) => {
  if (Array.isArray(children)) {
    return <>
      {children.map((element, index, children) => {
        return <GroupButtonContext.Provider value={{
          index,
          isFirst: index === 0,
          isLast: index === children.length - 1,
          isMiddle: index !== 0 && index !== children.length - 1,
        }}>
          {element}
        </GroupButtonContext.Provider>;
      })}
    </>;
  }

  return <>
    {children}
  </>;
};
