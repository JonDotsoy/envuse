export function* range(from: number, to: number) {
  if (from > to)
    throw new Error('param from is greater than param to');
  for (let current = from; current <= to; current += 1) {
    yield current;
  }
}
