import { BufferCursor } from "../lib/BufferCursor";
import { UnexpectedTokenError } from "../tdo/UnexpectedTokenError";
import { EventEmitter } from "events";
import util from "util";
import { BaseSerializeOption as BaseSerializeOption } from "../tdo/BaseSerializeOption";
import { TypeNamesList } from "../tdo/TypeNamesList";

export type BaseType = {
  $type: TypeNamesList;
};

export type BaseExportType = {
  pos: number;
  end: number;
  children?: BaseExportType[];
};

export type BaseExportTypeJSON<T = TypeNamesList> = BaseExportType & {
  $type: T;
};

export const printElement = (element: Base) =>
  `${element.toObjectName()} (${element.pos}, ${element.end}): ${JSON.stringify(
    element.body.slice(element.pos, element.end).toString()
  )}`;

type BodyAssigned<T> = T extends { propsMutable: infer R }
  ? R extends keyof T
  ? Partial<Pick<T, R>>
  : {}
  : {};

type BaseEvents = {
  create_element: (element: Base) => void;
};

type ArgsType<T> = T extends (...args: infer R) => void ? R : [];


export type RejectOptions = {
  message?: string
  position?: number
}


export abstract class Base {
  abstract $type: TypeNamesList;

  #events = new EventEmitter();

  end: number = this.pos;
  children: Base[] = [];
  #elementList: Base[] = [this];

  raw = Buffer.from([]);
  _raw: string = "";
  #filename: string | null;
  #bufferCursor: BufferCursor;
  #body: Buffer;

  constructor(
    filename: string | null,
    body: Buffer,
    public pos: number,
    bufferCursor = new BufferCursor(body)
  ) {
    this.#filename = filename;
    this.#bufferCursor = bufferCursor;
    this.#body = body;
  }

  toObjectName() {
    return this.constructor.name;
  }

  toString() {
    return printElement(this);
  }

  [util.inspect.custom]() {
    return printElement(this);
  }

  on<T extends keyof BaseEvents>(event: T, listener: BaseEvents[T]) {
    this.#events.on(event, listener);
    return () => {
      this.removeListener(event, listener);
    };
  }

  removeListener<T extends keyof BaseEvents>(
    event: T,
    listener: BaseEvents[T]
  ) {
    this.#events.removeListener(event, listener);
  }

  private emit<T extends keyof BaseEvents>(
    event: T,
    ...args: ArgsType<BaseEvents[T]>
  ) {
    this.#events.emit(event, ...args);
  }

  get filename() {
    return this.#filename;
  }
  get bufferCursor() {
    return this.#bufferCursor;
  }
  get body() {
    return this.#body;
  }
  get elementList() {
    return this.#elementList;
  }

  private load() {
    const unsubscribeForward = this.bufferCursor.on("forward", () => {
      this.end = this.bufferCursor.position;
    });
    const unsubscribeCreateElement = this.on("create_element", (element) => {
      this.#elementList.push(element);
    });
    this.prepare(this.bufferCursor);
    unsubscribeForward();
    unsubscribeCreateElement();
    return this;
  }

  createElement<T extends Base>(
    Comp: {
      new(
        filename: string | null,
        body: Buffer,
        pos: number,
        bufferCursor?: BufferCursor
      ): T;
    },
    assign?: BodyAssigned<T>
  ) {
    const comp = new Comp(
      this.filename,
      this.body,
      this.bufferCursor.position,
      this.bufferCursor
    );

    this.emit("create_element", comp);
    Base.createElement(comp, assign);

    const [, ...elements] = comp.elementList;

    this.elementList.push(...elements);

    return comp;
  }

  static createElement<T extends Base>(comp: T, assign?: BodyAssigned<T>) {
    if (assign) {
      Object.assign(comp, assign);
    }

    return comp.load();
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
    this.raw = Buffer.concat([
      this.raw,
      typeof raw === "number" ? Buffer.from([raw]) : raw,
    ]);
    this._raw = this.raw.toString();

    return this;
  }

  /** @deprecated */
  *iter() {
    let index = this.pos;

    while (true) {
      const char = this.body[index];
      if (char === undefined) break;

      const current_index = index;
      const current_char = Buffer.from([char]);
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

      yield [
        index,
        current_char,
        { current_char, current_index, prev, next },
      ] as const;

      index += 1;
    }
  }

  rejectUnexpectedTokenError(options?: RejectOptions): never {
    const err = new UnexpectedTokenError(
      this.filename,
      this.body,
      options?.position ?? this.bufferCursor.position,
      {
        message: options?.message ?? "Unexpected token",
      },
    );

    Error.captureStackTrace(err, Base.prototype.rejectUnexpectedTokenError);

    throw err;
  }

  lastChildren() {
    return this.children[this.children.length - 1];
  }

  removeChildren(children: Base) {
    this.children = this.children.filter((elm) => elm !== children);
  }

  toJSON() {
    return <BaseExportTypeJSON>{
      $type: this.$type,
      pos: this.pos,
      end: this.end,
      children: this.children.length ? (this.children as any[]) : undefined,
    };
  }

  static serialize(opts: BaseType): Buffer {
    return Buffer.from([]);
  }
}
