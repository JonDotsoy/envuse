import * as envuse from "./envuse";

describe("envuse", () => {
  it("shoud parse a buffer", () => {
    const buffer = Buffer.from("FOO=bar\nBAZ=qux\n", "utf8");
    const { parsed } = envuse.parse(buffer);
    expect(parsed).toEqual({
      FOO: "bar",
      BAZ: "qux",
    });
  });

  it("should create data source", () => {
    const buffer = Buffer.from("FOO=bar\nBAZ=qux\n", "utf8");
    const ast = envuse.createDataSource(buffer);
    expect(JSON.stringify(ast, null, 2)).toMatchSnapshot();
  });
});
