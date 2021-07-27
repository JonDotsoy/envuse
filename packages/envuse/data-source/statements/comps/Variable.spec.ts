import { inspect } from "util";
import { DataSource } from "../../data-source";
import { b } from "../lib/toBuffer";
import { Base } from "./Base";
import { Variable } from "./Variable";

describe("Variable", () => {
  it("should parse data source without value and include a comment", () => {
    const buf = b("FOO: VAR # comment");

    const block = DataSource.createDataSource(buf);

    // console.log(inspect(block.elementList))
    expect(inspect(block, { depth: Infinity })).toMatchInlineSnapshot(`
      "Block (0, 18): \\"FOO: VAR ...
        Variable (0, 18): \\"FOO: VAR ...
          VariableKey (0, 3): \\"FOO\\"
          SymbolColon (3, 4): \\":\\"
          Space (4, 5): \\" \\"
          VariableKey (5, 8): \\"VAR\\"
          Space (8, 9): \\" \\"
          Comment (9, 18): \\"# comment...
            Space (10, 11): \\" \\""
    `);
  });
  it("should parse data source without value and type and include a comment", () => {
    const buf = b("FOO # comment");

    const block = DataSource.createDataSource(buf);

    // console.log(inspect(block.elementList))
    expect(inspect(block, { depth: Infinity })).toMatchInlineSnapshot(`
      "Block (0, 13): \\"FOO # com...
        Variable (0, 13): \\"FOO # com...
          VariableKey (0, 3): \\"FOO\\"
          Space (3, 4): \\" \\"
          Comment (4, 13): \\"# comment...
            Space (5, 6): \\" \\""
    `);
  });

  it("should parse data source with only Variable Name", () => {
    const buf = b("FOO");

    const block = DataSource.createDataSource(buf);

    // console.log(inspect(block.elementList))
    expect(inspect(block, { depth: Infinity })).toMatchInlineSnapshot(`
      "Block (0, 3): \\"FOO\\"
        Variable (0, 3): \\"FOO\\"
          VariableKey (0, 3): \\"FOO\\""
    `);
  });

  it("should parse data source break with new line", () => {
    const buf = b("#; if true\nFOO#\n\n#: fi\n");

    const block = DataSource.createDataSource(buf);

    expect(inspect(block, { depth: Infinity })).toMatchInlineSnapshot(`
      "Block (0, 23): \\"#; if tru...
        CommentOperator (0, 23): \\"#; if tru...
          Space (2, 3): \\" \\"
          VariableKey (3, 5): \\"if\\"
          Space (5, 6): \\" \\"
          CommentOperatorStatement (6, 11): \\"true\\\\n\\"
            StatementObject<Boolean> (6, 10): \\"true\\"
          Block (11, 23): \\"FOO#\\\\n\\\\n#...
            Variable (11, 16): \\"FOO#\\\\n\\"
              VariableKey (11, 14): \\"FOO\\"
              Comment (14, 16): \\"#\\\\n\\"
            SpaceNewLine (16, 17): \\"\\\\n\\"
            Comment (17, 23): \\"#: fi\\\\n\\""
    `);
  });

  it("should parse data source with type required", () => {
    const buf = b("FOO!: number");

    const block = DataSource.createDataSource(buf);

    // console.log(inspect(block.elementList))
    expect(inspect(block, { depth: Infinity })).toMatchInlineSnapshot(`
      "Block (0, 12): \\"FOO!: num...
        Variable (0, 12): \\"FOO!: num...
          VariableKey (0, 3): \\"FOO\\"
          SymbolExclamationMark (3, 4): \\"!\\"
          SymbolColon (4, 5): \\":\\"
          Space (5, 6): \\" \\"
          VariableKey (6, 12): \\"number\\""
    `);

    const variable = block.elementList.find(
      (el): el is Variable => el instanceof Variable
    );

    expect(variable).toBeDefined();
    expect(variable?.required).toBeTruthy();
  });
});
