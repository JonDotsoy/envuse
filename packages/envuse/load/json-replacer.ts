export function jsonReplacer(key: string, value: any) {
  if (value instanceof Buffer) {
    return { $buffer: value.toString("base64") };
  }
  if (value instanceof Error) {
    return {
      $error: {
        ...value,
        name: value.name,
        message: value.message,
        stack: value.stack,
      },
    };
  }
  if (
    typeof value === "object" &&
    value.type === "Buffer" &&
    Array.isArray(value.data)
  ) {
    return { $buffer: Buffer.from(value.data).toString("base64") };
  }
  return value;
}

export const jsonStringify = (value: any) =>
  JSON.stringify(jsonReplacer("", value), jsonReplacer);
