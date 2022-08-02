import * as envuse from "envuse-wasm";
import { Node, Document, NodeDocument } from "./types/node";

export const parse = (payload: string): NodeDocument => {
  return envuse.parse(payload);
};

export const parseLocation = (payload: string, location: URL): NodeDocument => {
  return envuse.parse(payload);
};
