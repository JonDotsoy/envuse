export function b(data: string | number[]) {
  if (typeof data === "string") return Buffer.from(data);
  return Buffer.from(data);
}

b.c = Buffer.concat;
