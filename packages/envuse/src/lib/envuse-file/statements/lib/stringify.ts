import { Base } from "../comps/Base"
import * as comps from "../comps/_compsList"

const serialize_comp = (comp: Base) => {
  switch (comp.$type) {
    default: throw new Error(`No possible serialize component with type ${comp.$type}`);
  }
}

export const stringify = (comp: comps.Block) => {
  return serialize_comp(comp)
}
