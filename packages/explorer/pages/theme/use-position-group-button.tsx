import { useContext } from "react";
import { GroupButtonContext } from "./GroupButtonContext";

export const usePositionGroupButton = () => useContext(GroupButtonContext);
