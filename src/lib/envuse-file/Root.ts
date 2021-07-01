import { Base } from "./Base";
import { Iter } from "./Iter";
import { Comment } from "./Comment";
import { Code } from "./Code";

export class Root extends Base {
  prepare(gen: Iter) {
    while (true) {
      const { done, value } = gen.next();
      if (done || !value) return;
      const [index, , { prev, next }] = value;


      if (
        (prev(2).equals(Buffer.from([0x23])) && next(2).equals(Buffer.from([0x23, 0x3b]))) ||
        (prev(2).equals(Buffer.from([0x0a, 0x23])) && next(2).equals(Buffer.from([0x23, 0x3b])))
      ) {
        gen.next();
        this.children.push(new Code(this.body, index, gen).load());
      }


      if (prev(2).equals(Buffer.from([0x23])) ||
        prev(2).equals(Buffer.from([0x0a, 0x23]))) {
        this.children.push(new Comment(this.body, index, gen).load());
      }
    }
  }
}
