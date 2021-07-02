import { BufferCursor } from "./BufferCursor";
import { Iter } from "./Iter";
import { UnexpectedTokenError } from "./UnexpectedTokenError";

export abstract class Base {
  end!: number;
  children: Base[] = [];

  raw = Buffer.from([]);
  _raw: string = '';

  constructor(
    readonly filename: string | null,
    readonly body: Buffer,
    public pos: number,
    readonly bufferCursor = new BufferCursor(body),
  ) { }

  private load() {
    this.prepare(this.bufferCursor);
    return this;
  }

  createElement<T extends Base>(Comp: { new(filename: string | null, body: Buffer, pos: number, bufferCursor?: BufferCursor): T }) {
    return new Comp(this.filename, this.body, this.bufferCursor.position, this.bufferCursor).load();
  }

  static createElement<T extends Base>(comp: T) {
    return comp.load()
  }

  abstract prepare(bufferCursor: BufferCursor): void;

  // f(cb: (gen: Iter, ) => void) {
  //   const gen = this.ngen();
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
}
