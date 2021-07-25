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
    expect(JSON.stringify(ast, null, 2)).toMatchInlineSnapshot(`
      "{
        \\"$type\\": \\"Block\\",
        \\"pos\\": 0,
        \\"end\\": 16,
        \\"children\\": [
          {
            \\"$type\\": \\"Variable\\",
            \\"pos\\": 0,
            \\"end\\": 7,
            \\"keyVariable\\": {
              \\"$type\\": \\"VariableKey\\",
              \\"pos\\": 0,
              \\"end\\": 3,
              \\"value\\": \\"FOO\\"
            },
            \\"valueVariable\\": {
              \\"$type\\": \\"VariableValue\\",
              \\"pos\\": 4,
              \\"end\\": 7,
              \\"value\\": \\"bar\\"
            }
          },
          {
            \\"$type\\": \\"SpaceNewLine\\",
            \\"pos\\": 7,
            \\"end\\": 8
          },
          {
            \\"$type\\": \\"Variable\\",
            \\"pos\\": 8,
            \\"end\\": 15,
            \\"keyVariable\\": {
              \\"$type\\": \\"VariableKey\\",
              \\"pos\\": 8,
              \\"end\\": 11,
              \\"value\\": \\"BAZ\\"
            },
            \\"valueVariable\\": {
              \\"$type\\": \\"VariableValue\\",
              \\"pos\\": 12,
              \\"end\\": 15,
              \\"value\\": \\"qux\\"
            }
          },
          {
            \\"$type\\": \\"SpaceNewLine\\",
            \\"pos\\": 15,
            \\"end\\": 16
          }
        ]
      }"
    `);
  });
});
