import { BCharType } from "./BCharType";
import { ArrCursor } from "./ArrCursor";


// <T extends BCharType = BCharType>
export class BufferCursor<T = number> extends ArrCursor<T> { }
