import * as b from "./builder";

describe("builder", () => {
  it("parse options", () => {
    const a = b.Opts(b.option("foo", String), b.option("baz", String));

    console.log(b.parseOptions(a, ["--foo", "bar", "--baz", "qux"]));
    console.log(b.parseOptions(a, ["--baz", "qux", "--foo", "bar"]));
  });
});
