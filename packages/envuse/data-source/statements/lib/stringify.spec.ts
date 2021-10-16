import { stringify } from "./stringify";
import { b } from "./to-buffer";
import { DataSource } from "../../data-source";
import { BlockType } from "../components/block";

describe("parse ast", () => {
  it("should parse ast variable", () => {
    const body = DataSource.createDataSource(Buffer.concat([b(`a=3\n`)]));

    expect(JSON.stringify(body, null, 2)).toMatchSnapshot();
  });

  it("should parse ast operator", () => {
    const body = DataSource.createDataSource(
      Buffer.concat([b(`#; if true\n`), b(`a=b\n`), b(`#; fi\n`)])
    );

    expect(JSON.stringify(body, null, 2)).toMatchSnapshot();
  });
});

describe("serialize", () => {
  it("serialize component block", () => {
    const block: BlockType = {
      $type: "Block",
      children: [
        {
          $type: "Variable",
          keyVariable: {
            $type: "VariableKey",
            value: "aa",
          },
          valueVariable: {
            $type: "VariableValue",
            value: "bbb",
          },
        },
      ],
    };

    expect(stringify(block).toString()).toMatchInlineSnapshot(`
    "aa : string = \\"bbb\\"
    "
    `);
  });

  it("serialize component variable and comment", () => {
    const block: BlockType = {
      $type: "Block",
      children: [
        {
          $type: "Comment",
          value: "Iam comment",
        },
        {
          $type: "Variable",
          keyVariable: {
            $type: "VariableKey",
            value: "aaa",
          },
          valueVariable: {
            $type: "VariableValue",
            value: "bbb",
          },
        },
      ],
    };

    expect(stringify(block).toString()).toMatchInlineSnapshot(`
    "# Iam comment
    aaa : string = \\"bbb\\"
    "
    `);
  });

  it("serialize component variable and comment", () => {
    const block = DataSource.createDataSource(
      Buffer.concat([b(`#; if true === true\n`), b(`aaa=bbb\n`), b(`#; fi\n`)])
    );

    expect(stringify(block).toString()).toMatchInlineSnapshot(`
    "#; if true === true
    aaa : string = \\"bbb\\"
    #; fi
    "
    `);
  });

  it("should serialize component complex", () => {
    const block = DataSource.createDataSource(
      Buffer.concat([
        b(`# single comment\n`),
        b(`abc=abc\n`),
        b(`c="abnc\\nasd"\n`),
        b(`#;if true === 12 === abc.def === "abc"\n`),
        b(`cde=321\n`),
        b(`#;fi\n`),
        b(`\n`),
        b(`# Comment\n`),
        b(`other=true\n`),
      ])
    );

    expect(stringify(block).toString()).toMatchInlineSnapshot(`
      "# single comment
      abc : string = \\"abc\\"
      c : string = \\"abnc\\\\nasd\\"
      #; if true === 12 === abc.def === \\"abc\\"
      cde : string = \\"321\\"
      #; fi
      # Comment
      other : string = \\"true\\"
      "
    `);
  });

  it("should serialize component declaration manual", () => {
    const block: BlockType = {
      $type: "Block",
      children: [
        {
          $type: "Comment",
          value: "I am comment",
        },
        {
          $type: "CommentOperator",
          operator: {
            $type: "VariableKey",
            value: "if",
          },
          statement: {
            $type: "CommentOperatorStatement",
            statements: [
              {
                $type: "StatementObject",
                type: "Boolean",
                value: true,
              },
            ],
          },
          block: {
            $type: "Block",
            children: [],
          },
        },
      ],
    };

    expect(stringify(block).toString()).toMatchInlineSnapshot(`
      "# I am comment
      #; if true
      #; fi
      "
    `);
  });
});
