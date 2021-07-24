import { BufferCursor } from "../lib/BufferCursor";
import { TypeNamesList } from "../tdo/TypeNamesList";
import { Base } from "./Base";

export class BlockComment extends Base {
  $type = "BlockComment" as const;

  prepare(bufferCursor: BufferCursor): void {
    
    

  }
}
