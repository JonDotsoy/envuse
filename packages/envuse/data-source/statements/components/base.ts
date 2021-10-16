import { BufferCursor } from "../lib/buffer-cursor";
import { UnexpectedTokenError } from "../tdo/unexpected-token-error";
import { EventEmitter } from "events";
import util, { inspect, InspectOptions } from "util";
import { TypeNamesList } from "../tdo/type-names-list";

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

const elmPrefix = (elm: Base) => {
  let countPrefix = 0;
  let currentElement = elm;

  while (currentElement.parent) {
    countPrefix += 1;
    currentElement = currentElement.parent;
  }

  if (elm.parent) {
    return `${`  `.repeat(countPrefix)}`;
  }

  return "";
};

export const printBodyElement = (element: Base) => {
  const str = JSON.stringify(
    element.body.slice(element.pos, element.end).toString()
  );
  if (element.elementList.length > 1) {
    return str.length > 10 ? `${str.substring(0, 10)}...` : str;
  }
  return str;
};

export const printElement = (element: Base) =>
  `${element.toObjectName()} (${element.pos}, ${
    element.end
  }): ${printBodyElement(element)}`;

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
  message?: string;
  position?: number;
};

export abstract class Base {
  abstract $type: TypeNamesList;

  #events = new EventEmitter();

  #parent: Base | null = null;

  end: number = this.pos;
  children: Base[] = [];
  oChildren: Base[] = [];
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

  get parent() {
    return this.#parent;
  }

  toObjectName() {
    return this.constructor.name;
  }

  toString() {
    return printElement(this);
  }

  [util.inspect.custom](depth: number, inspectOptions: InspectOptions) {
    let out = `${printElement(this)}`;

    const oChildren = this.oChildren.filter((c) => {
      if (inspectOptions.showHidden === true) return true;

      // Hidden elements
      const hiddenElements: TypeNamesList[] = ["Space", "SpaceNewLine"];

      return !hiddenElements.includes(c.$type);
    });

    if (depth <= 0) {
      return `${out}${oChildren.length ? `\n  ...` : ``}`;
    }

    // console.log(inspectOptions)
    if (oChildren.length) {
      for (const child of oChildren) {
        out += `\n`;
        out += inspect(child, { ...inspectOptions, depth: depth - 1 })
          .replace(/(^)/, "  ")
          .replace(/\n/g, "\n  ");
      }
      // out += `\n${this.oChildren.map(el => el[util.inspect.custom](depth, inspectOptions)).join("\n")}`;
    }
    return out;
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
      new (
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

    comp.#parent = this;

    const [, ...elements] = comp.elementList;

    this.elementList.push(...elements);
    this.oChildren.push(comp);

    return comp;
  }

  static createElement<T extends Base>(comp: T, assign?: BodyAssigned<T>) {
    if (assign) {
      Object.assign(comp, assign);
    }

    return comp.load();
  }

  abstract prepare(bufferCursor: BufferCursor): void;

  appendRaw(raw: Buffer | number) {
    this.raw = Buffer.concat([
      this.raw,
      typeof raw === "number" ? Buffer.from([raw]) : raw,
    ]);
    this._raw = this.raw.toString();

    return this;
  }

  rejectUnexpectedTokenError(options?: RejectOptions): never {
    const err = new UnexpectedTokenError(
      this.filename,
      this.body,
      options?.position ?? this.bufferCursor.position,
      {
        message: options?.message ?? "Unexpected token",
      }
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
