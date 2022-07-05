class Pos {
  constructor(readonly pos: number) {}
  static restart = new Pos(-1);
}

let index = -1;
function* citer<T>(arr: T[]): Generator<T, void, number | Pos | undefined> {
  while (index < arr.length - 1) {
    index += 1;
    const s = yield arr[index];
    if (s instanceof Pos) {
      index = s.pos;
    } else {
      index += s ?? 0;
    }
  }
}

export class BuilderOption<K, T> {
  constructor(readonly key: K, readonly typeParser: (v: any) => T) {}
}
export const option = <K, T>(key: K, typeParser: (v: any) => T) =>
  new BuilderOption(key, typeParser);

export class BuilderCommand<T> {
  constructor(readonly command: T) {}
}
export const command = <T>(command: T) => new BuilderCommand(command);

export class BuilderOpts<T> {
  constructor(readonly options: T[]) {}
}
interface BuilderOtpsType {
  <A>(a: A): BuilderOpts<A>;
  <A, B>(a: A, b: B): BuilderOpts<[A, B]>;
  <A, B, C>(a: A, b: B, c: C): BuilderOpts<[A, B, C]>;
  <A, B, C, D>(a: A, b: B, c: C, d: D): BuilderOpts<[A, B, C, D]>;
  <A, B, C, D, E>(a: A, b: B, c: C, d: D, e: E): BuilderOpts<[A, B, C, D, E]>;
  <A, B, C, D, E, F>(a: A, b: B, c: C, d: D, e: E, f: F): BuilderOpts<
    [A, B, C, D, E, F]
  >;
  <A, B, C, D, E, F, G>(a: A, b: B, c: C, d: D, e: E, f: F, g: G): BuilderOpts<
    [A, B, C, D, E, F, G]
  >;
  <A, B, C, D, E, F, G, H>(
    a: A,
    b: B,
    c: C,
    d: D,
    e: E,
    f: F,
    g: G,
    h: H
  ): BuilderOpts<[A, B, C, D, E, F, G, H]>;
  <A, B, C, D, E, F, G, H, I>(
    a: A,
    b: B,
    c: C,
    d: D,
    e: E,
    f: F,
    g: G,
    h: H,
    i: I
  ): BuilderOpts<[A, B, C, D, E, F, G, H, I]>;
  <A, B, C, D, E, F, G, H, I, J>(
    a: A,
    b: B,
    c: C,
    d: D,
    e: E,
    f: F,
    g: G,
    h: H,
    i: I,
    j: J
  ): BuilderOpts<[A, B, C, D, E, F, G, H, I, J]>;
}
export const Opts: BuilderOtpsType = (...a: any[]) => new BuilderOpts(a);

export class BuilderOptional<T> {
  constructor(readonly optional: T) {}
}
export const optional = <T>(optional: T) => new BuilderOptional(optional);

export type Builder =
  | BuilderOption<unknown, unknown>
  | BuilderCommand<unknown>
  | BuilderOpts<unknown>
  | BuilderOptional<unknown>;

export function* parseOptionsB(
  builder: any,
  args: Generator<string, void, number>
): Generator<any, undefined, never> {
  if (!builder) return;

  if (builder instanceof BuilderOpts) {
    const iterOptions = citer(builder.options);
    for (const option of iterOptions) {
      // console.log({ option });
      // @ts-ignore
      for (const e of parseOptionsB(option, args)) {
        if (e) {
          yield e;
          iterOptions.next(Pos.restart);
        }
      }
    }
    return;
  }

  if (builder instanceof BuilderOption) {
    const res = args.next();

    if (res.done) return;
    if (res.value === `--${builder.key}`) {
      const resValue = args.next();
      yield {
        [builder.key]: resValue.value,
      };
      return;
    }

    args.next(-2);
  }
}

export function parseOptions(builder: Builder | undefined, args: string[]) {
  const a = citer(args);

  return Array.from(parseOptionsB(builder, a));
}
