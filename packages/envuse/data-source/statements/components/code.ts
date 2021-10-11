import { Base } from "./base";

export class Code extends Base {
  $type = "Code" as const;

  prepare() {
    // let initialized = false
    // while (true) {
    //   const { done, value } = gen.next();
    //   if (done || !value)
    //     return;
    //   const [index, current_char, { next }] = value;
    //   if (!initialized && current_char.equals(Buffer.from([0x20]))) {
    //     if (next(2).equals(Buffer.from([0x20, 0x20]))) continue;
    //     initialized = true;
    //     this.pos = index;
    //     continue;
    //   }
    //   if (
    //     current_char.equals(Buffer.from([0x0a]))
    //   ) {
    //     if (next(2).equals(Buffer.from([0x0a, 0x23]))) {
    //       gen.next()
    //       continue;
    //     }
    //     return;
    //   }
    //   this.appendRaw(current_char);
    // }
  }
}
