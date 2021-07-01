import { Base } from "./Base";
import { Iter } from "./Iter";


export class Comment extends Base {
  prepare(gen: Iter) {
    while (true) {
      const { done, value } = gen.next();
      if (done || !value)
        return;
      const [, current_char, { next }] = value;
      this.appendRaw(current_char);
      if (
        current_char.equals(Buffer.from([0x0a]))
      ) {
        if (next(2).equals(Buffer.from([0x0a, 0x23]))) {
          gen.next()
          continue;
        }
        return;
      }
    }
  }
}
