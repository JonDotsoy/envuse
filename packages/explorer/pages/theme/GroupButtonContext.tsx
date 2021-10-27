import React from "react";

export const GroupButtonContext = React.createContext<null | { index?: number; isMiddle?: boolean; isLast?: boolean; isFirst?: boolean; }>(null);
