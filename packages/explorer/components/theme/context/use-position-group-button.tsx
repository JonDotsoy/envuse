import { useContext } from "react";
import { GroupButtonContext } from "./group-button.context";

export const usePositionGroupButton = () => useContext(GroupButtonContext);
