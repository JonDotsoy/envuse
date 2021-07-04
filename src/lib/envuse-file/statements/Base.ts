import { BufferCursor } from "./BufferCursor";
import { Iter } from "./Iter";
import { UnexpectedTokenError } from "./UnexpectedTokenError";

type B<T> = T extends { propsMutable: infer R } ? R extends keyof T ? Partial<Pick<T, R>> : {} : {}

export abstract class Base {
  end!: number;
  children: Base[] = [];

  raw = Buffer.from([]);
  _raw: string = '';
  #filename: string | null;
  #bufferCursor: BufferCursor
  #body: Buffer

  constructor(
    filename: string | null,
    body: Buffer,
    public pos: number,
    bufferCursor = new BufferCursor(body),
  ) {
    this.#filename = filename;
    this.#bufferCursor = bufferCursor
    this.#body = body
  }

  get filename() { return this.#filename; }
  get bufferCursor() { return this.#bufferCursor; }
  get body() { return this.#body; }

  private load() {
    this.prepare(this.bufferCursor);
    return this;
  }

  createElement<T extends Base>(Comp: { new(filename: string | null, body: Buffer, pos: number, bufferCursor?: BufferCursor): T }, assign?: B<T>) {
    const comp = new Comp(this.filename, this.body, this.bufferCursor.position, this.bufferCursor);

    return Base.createElement(comp, assign)
  }

  static createElement<T extends Base>(comp: T, assign?: B<T>) {
    if (assign) {
      Object.assign(comp, assign)
    }

    return comp.load()
  }

  abstract prepare(bufferCursor: BufferCursor): void;

  // f(cb: (gen: Iter, ) => void) {
  //   const gen = this.ngen();envuseFileParser.toAstBody()
  //   while (true) {
  //     const { done, value } = gen.next();
  //     if (done || !value) return;
  //     const [index, current_char, { prev, next }] = value;

  //     cb
  //   }
  // }

  appendRaw(raw: Buffer | number) {
    this.raw = Buffer.concat([this.raw, typeof raw === 'number' ? Buffer.from([raw]) : raw]);
    this._raw = this.raw.toString();

    return this;
  }

  *iter() {
    let index = this.pos;

    while (true) {
      const char = this.body[index];
      if (char === undefined)
        break;

      const current_index = index;
      const current_char = Buffer.from([char])
      const prev = (len: number) => {
        const begin = Math.max(index - len + 1, 0);
        const end = Math.min(index + 1, this.body.length);
        return this.body.slice(begin, end);
      };
      const next = (len: number) => {
        const begin = Math.max(index, 0);
        const end = Math.min(index + len, this.body.length);
        return this.body.slice(begin, end);
      };

      yield [index, current_char, { current_char, current_index, prev, next }] as const;

      index += 1;
    }
  }

  rejectUnexpectedTokenError(): never {
    const err = new UnexpectedTokenError(this.filename, this.body, this.bufferCursor.position)

    Error.captureStackTrace(err, Base.prototype.rejectUnexpectedTokenError)

    throw err;
  }

  toJSON() {
    return {}
  }
}
