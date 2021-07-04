export function toBuffer(data: string | number[]) {
  if (typeof data === 'string') return Buffer.from(data);
  return Buffer.from(data);
}
