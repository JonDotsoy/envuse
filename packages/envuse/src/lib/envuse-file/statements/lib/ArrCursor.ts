import { range } from "./range";
import { EventEmitter } from "events";
import { ArgsType } from "../tdo/ArgsType";
import { EventsArrCursor } from "../tdo/EventsArrCursor";

export class ArrCursor<T, B extends T | undefined = T | undefined> {
  #event = new EventEmitter();
  #position = 0;

  constructor(private body: T[] | Buffer) { }

  // Events Methods
  on<T extends keyof EventsArrCursor>(event: T, listener: EventsArrCursor[T]) {
    this.#event.on(event, listener);
    return () => {
      this.removeListener(event, listener);
    };
  }

  removeListener<T extends keyof EventsArrCursor>(event: T, listener: EventsArrCursor[T]) {
    this.#event.removeListener(event, listener);
  }

  private emit<T extends keyof EventsArrCursor>(event: T, ...args: ArgsType<EventsArrCursor[T]>) {
    this.#event.emit(event, ...args);
  }

  get position() {
    return this.#position;
  }

  has(): this is ArrCursor<T, Exclude<B, undefined>> {
    return this.current() !== undefined;
  }

  current() {
    return this.body[this.position] as unknown as B;
  }

  forward(steps: number = 1) {
    this.#position += steps;
    this.emit("forward");
    return this.current();
  }

  backward(steps: number = 1) {
    this.#position -= steps;

    return this.current();
  }

  prev(len: number) {
    return Array.from(range(this.position - len, this.position - 1)).map(
      (i) => this.body[i]
    );
  }

  currentAndPrev(len: number) {
    return [...this.prev(len - 1), this.current()];
  }

  next(len: number) {
    return Array.from(range(this.position + 1, this.position + len)).map(
      (i) => this.body[i]
    );
  }

  currentAndNext(len: number) {
    return [this.current(), ...this.next(len - 1)];
  }

  isClosed(): any {
    return this.position === this.body.length;
  }
}
