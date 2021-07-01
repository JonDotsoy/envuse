import { Iter } from "./Iter";

export abstract class Base {
  end!: number;
  children: Base[] = [];
  #gen: Iter | undefined;

  raw = Buffer.from([]);
  _raw: string = '';

  constructor(
    readonly body: Buffer,
    readonly pos: number,
    gen?: Iter
  ) {
    this.#gen = gen;
  }

  load() {
    this.prepare(this.#gen ?? this.iter());
    return this;
  }

  abstract prepare(gen: Iter): void;

  appendRaw(raw: Buffer) {
    this.raw = Buffer.concat([this.raw, raw]);
    this._raw = this.raw.toString();

    return this;
  }

  *iter() {
    let index = this.pos;

    while (true) {
      const char = this.body[index];
      if (char === undefined)
        break;

      const current_pos = () => index;
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

      yield [index, Buffer.from([char]), { current_pos, prev, next }] as const;

      index += 1;
    }
  }
}
