import { BlockType } from "../comps/Block";
import * as comps from "../comps/_compsList";
import { stringifyCtx } from "./stringifyCtx";
import { StringifyOptions } from "./StringifyOptions";

const serialize_comp = (comp: BlockType) => {
  switch (comp.$type) {
    case "Block":
      return comps.Block.serialize(comp);
    default:
      throw new Error(
        `No possible serialize component with type ${comp.$type}`
      );
  }
};

export const stringify = (comp: BlockType, options?: StringifyOptions) => {
  stringifyCtx.start(options);
  const res = serialize_comp(comp);
  stringifyCtx.end();
  return res;
};
