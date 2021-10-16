import { isMessage } from "./is-message";

export function toMessage(data: Buffer) {
  let parsed: any;

  try {
    parsed = JSON.parse(data.toString());
  } catch (ex) {}

  return isMessage(parsed) ? parsed : null;
}
