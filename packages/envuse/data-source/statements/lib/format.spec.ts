import { inspect } from "util";
import { singleFormt } from "./format";
import { takeDemoFile } from "./take-demo-file";

describe("format", () => {
  it("should format", () => {
    const [fl, buf] = takeDemoFile();

    const res = singleFormt(buf);

    // console.log(inspect(res))
  });
});
