import { BCharType } from "../tdo/b-char-type";
import { ArrCursor } from "./arr-cursor";

// <T extends BCharType = BCharType>
export class BufferCursor<T = number> extends ArrCursor<T> {}
