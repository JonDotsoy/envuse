import { range } from "./range";
import { EventEmitter } from "events";
import { ArgsType } from "../tdo/ArgsType";
import { EventsArrCursor } from "../tdo/EventsArrCursor";


export enum ArrCursorMatchActions {
  stop,
  continue,
  breakSuccess,
}

export type Validator<T extends ArrCursor<any>> = (cursor: T, actions: typeof ArrCursorMatchActions) => ArrCursorMatchActions | void


export class ArrCursor<T, B extends T | undefined = T | undefined> {
  #event = new EventEmitter();
  #position = 0;

  constructor(private body: T[] | Buffer) { }

  private setPosition(position: number) {
    this.#position = position;
  }

  printDescriptor() {
    const current = this.current();
    const isNumber = (v: any): v is number => typeof current === "number";
    const txt = `position: ${this.position} current: ${current} json preview: ${isNumber(current) ? JSON.stringify(Buffer.from([current]).toString()) : ""}`
    console.log(txt)
    return txt
  }

  clone() {
    const cursor = new ArrCursor<T, B>(this.body)
    cursor.setPosition(this.position)
    return cursor
  }

  // Events Methods
  on<T extends keyof EventsArrCursor>(event: T, listener: EventsArrCursor[T]) {
    this.#event.on(event, listener);
    return () => {
      this.removeListener(event, listener);
    };
  }

  removeListener<T extends keyof EventsArrCursor>(
    event: T,
    listener: EventsArrCursor[T]
  ) {
    this.#event.removeListener(event, listener);
  }

  private emit<T extends keyof EventsArrCursor>(
    event: T,
    ...args: ArgsType<EventsArrCursor[T]>
  ) {
    this.#event.emit(event, ...args);
  }

  get position() {
    return this.#position;
  }

  hasOrEnd() {
    return this.position <= this.body.length;
  }

  has(): this is ArrCursor<T, Exclude<B, undefined>> {
    return this.current() !== undefined;
  }

  current() {
    return this.body[this.position] as unknown as B;
  }

  currentIs(v: B) {
    return this.current() === v;
  }

  forward(steps: number = 1) {
    this.#position += steps;
    this.emit("forward");
    return this.current();
  }

  backward(steps: number = 1) {
    this.#position -= steps;
    this.emit("backward");
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

  isClosed(): boolean {
    return this.position === this.body.length;
  }

  static ["match.actions"] = ArrCursorMatchActions

  /**
   * ## Validator
   * 
   * Use a validator to continue the match process. If return `ArrCursorMatchActions.stop`, the match process will stop and return false.
   * Y return `ArrCursorMatchActions.continue`, the match process will continue with the next validator.
   * If all validator return `ArrCursorMatchActions.continue`, the match return true.
   */
  match(...validators: Validator<this>[]) {
    const success = () => [true, this] as const;
    const failed = () => [false, this] as const;
    if (validators.length === 0) return failed()

    for (const [index, validator] of Object.entries(validators)) {
      const action = validator(this, ArrCursorMatchActions) ?? ArrCursorMatchActions.stop
      // if validator is end validators
      if (Number(index) === validators.length - 1) {
        if (action === ArrCursorMatchActions.continue) return success()
      }
      if (action === ArrCursorMatchActions.stop) return failed()
      if (action === ArrCursorMatchActions.continue) continue
      if (action === ArrCursorMatchActions.breakSuccess) return success()
    }

    return failed();
  }


}

