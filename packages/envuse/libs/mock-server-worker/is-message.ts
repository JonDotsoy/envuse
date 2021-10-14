import { Message } from "./types/message";

export function isMessage(obj: any): obj is Message {
  if (typeof obj !== "object") {
    return false;
  }

  if (typeof obj.$type !== "string") {
    return false;
  }

  return true;
}
