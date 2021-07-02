import { BCharType } from "./BCharType";
import { range } from "./range";


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
    return Array.from(range(this.position - len, this.position - 1)).map(i => this.body[i]);
  }

  next(len: number) {
    return Array.from(range(this.position + 1, this.position + len)).map(i => this.body[i]);
  }
}
