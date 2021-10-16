import { BlockType } from "../components/block";
import * as comps from "../components/_comps-list";
import { stringifyCtx } from "./stringify-ctx";
import { StringifyOptions } from "./stringify-options";

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
