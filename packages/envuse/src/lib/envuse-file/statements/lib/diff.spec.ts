import { EnvuseFileParser } from "../../envuse-file-parser";
import { diff } from "./diff";
import { b } from "./toBuffer"

describe("diff", () => {

  it("should diff deleted", () => {

    const block1 = EnvuseFileParser.parseToAst(Buffer.concat([
      b("foo=bar\n"),
      b("aaa=bbb\n"),
      b("ccc=ddd\n"),
      b("hhh=iii\n"),
    ]))

    const block2 = EnvuseFileParser.parseToAst(Buffer.concat([
      b("foo=bar\n"),
      b("aaa=bbb\n"),
      b("eee=fff\n"),
      b("hhh=jjj\n"),
    ]));

    console.log(diff(block1, block2));


  })

})

