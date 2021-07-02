import { Iter } from "./Iter";
import { range } from "./range";

export type BCharType = number | undefined;

const isBCharType = (v: any): v is BCharType => typeof v === 'undefined' || typeof v === 'number';

export class BufferCursor<T extends BCharType = BCharType> {
  position = 0;

  constructor(
    private body: Buffer
  ) { }

  has(): this is BufferCursor<Exclude<T, undefined>> {
    return this.current() !== undefined;
  }

  current() {
    return this.body[this.position] as unknown as T;
  }

  forward() {
    this.position += 1;

    return this.current();
  }

  backward() {
    this.position += 1;

    return this.current();
  }

  prev(len: number) {
    return Array.from(range(this.position - len, this.position - 1)).map(i => this.body[i])
  }

  next(len: number) {
    return Array.from(range(this.position + 1, this.position + len)).map(i => this.body[i])
  }
}

export abstract class Base {
  end!: number;
  children: Base[] = [];

  raw = Buffer.from([]);
  _raw: string = '';

  constructor(
    readonly body: Buffer,
    public pos: number,
    readonly bufferCursor = new BufferCursor(body),
  ) { }

  private load() {
    this.prepare(this.bufferCursor);
    return this;
  }

  createElement<T extends Base>(Comp: { new(body: Buffer, pos: number, bufferCursor?: BufferCursor): T }) {
    return new Comp(this.body, this.bufferCursor.position, this.bufferCursor).load();
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
}
