import { Base, BaseType } from "../comps/Base"
import { BlockType } from "../comps/Block";
import * as comps from "../comps/_compsList"

const serialize_comp = (comp: BlockType) => {
  switch (comp.$type) {
    case "Block": return comps.Block.serialize(comp);
    default: throw new Error(`No possible serialize component with type ${comp.$type}`);
  }
}

export const stringify = (comp: BlockType) => {
  return serialize_comp(comp)
}
