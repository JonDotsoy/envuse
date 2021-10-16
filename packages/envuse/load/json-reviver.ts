export function jsonReviver(key: string, value: any) {
  if (value === null) return null;
  if (typeof value === "object" && "$buffer" in value) {
    return Buffer.from(value.$buffer, "base64");
  }
  if (typeof value === "object" && "$error" in value) {
    const err = value.$error;
    Object.setPrototypeOf(err, Error.prototype);
    return err;
  }
  return value;
}

export const jsonParse = (text: string) => JSON.parse(text, jsonReviver);
