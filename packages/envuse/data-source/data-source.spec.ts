import { DataSource } from "./data-source";
import { takeDemoFile } from "./statements/lib/takeDemoFile";
import util from "util";
import { CommentOperator } from "./statements/comps/CommentOperator";
import { CommentOperatorStatement } from "./statements/comps/CommentOperatorStatement";
import { StatementObject } from "./statements/comps/StatementObject";
import { Base } from "./statements/comps/Base";
import { b } from "./statements/lib/toBuffer";

describe("DataSource", () => {
  it("shoud make a ast out", () => {
    const [filename1, body1] = takeDemoFile();

    const envuseFileParser = new DataSource(filename1, body1);
    expect(
      util.formatWithOptions(
        { depth: Infinity },
        "",
        envuseFileParser.toAstBody()
      )
    ).toMatchSnapshot();
  });

  it("shoud make a ast with operators", () => {
    const [filename, body] = takeDemoFile();

    const envuseFileParser = new DataSource(filename, body);
    expect(
      util.formatWithOptions(
        { depth: Infinity },
        "",
        envuseFileParser.toAstBody()
      )
    ).toMatchSnapshot();
    // console.log(util.formatWithOptions({ depth: Infinity }, '', envuseFileParser.toAstBody()))
  });

  it("shoud make a ast with multiple blocks", () => {
    const [filename, body] = takeDemoFile(".env");

    const envuseFileParser = new DataSource(filename, body);
    expect(
      util.formatWithOptions(
        { depth: Infinity },
        "",
        envuseFileParser.toAstBody()
      )
    ).toMatchSnapshot();
    // console.log(util.formatWithOptions({ depth: Infinity }, '', envuseFileParser.toAstBody()))
  });

  describe("parse statement", () => {
    it("parse statement operation", () => {
      const body = Buffer.from("true ===   false # asd");

      const cmp = Base.createElement(
        new CommentOperatorStatement("a", body, 0)
      );

      expect(cmp).toMatchSnapshot();
    });

    it("should parse statement with numbers", () => {
      const body = Buffer.from("34214324 ===   22_343.32 # comment");

      const cmp = Base.createElement(
        new CommentOperatorStatement("a", body, 0)
      );

      expect(cmp).toMatchSnapshot();
      // console.log(cmp)
    });

    it("should parse StatementObject string", () => {
      const [fl, body] = takeDemoFile();

      const cmp = Base.createElement(new StatementObject(fl, body, 0));

      // expect(cmp).toMatchSnapshot()
      // console.log(cmp)
    });

    it("should parse statement with string", () => {
      const [fl, body] = takeDemoFile();

      Base.createElement(new CommentOperatorStatement(fl, body, 0));

      // expect(cmp).toMatchSnapshot()
      // console.log(cmp)
    });

    it("should parse statement with string and special characters", () => {
      const [fl, body] = takeDemoFile(".special-characters.txt");

      const cmp = Base.createElement(new StatementObject(fl, body, 0));

      expect(cmp.value).toEqual("\n\t");
    });

    it("should parse instance path", () => {
      const body = Buffer.from("obj.a.b.VAL2");

      const cmp = Base.createElement(new StatementObject("a", body, 0));

      expect(cmp).toBeInstanceOf(StatementObject);
      expect(cmp.$type).toEqual("StatementObject");
      expect(cmp.type).toEqual("NameInstance");
      expect(cmp.value).toEqual(["obj", "a", "b", "VAL2"]);
    });

    it("should parse numbers", () => {
      const body = b("1_321.123");

      const cmp = Base.createElement(new StatementObject("a", body, 0));

      expect(cmp.value).toEqual(1_321.123);
    });

    it("should parse strings", () => {
      const body = b('"hi"');

      const cmp = Base.createElement(new StatementObject(null, body, 0));

      expect(cmp.value).toEqual("hi");
    });

    it("should parse statement with variables", () => {
      const body = Buffer.from("VAL1 ===   obj.a.b.VAL2 # comment");

      const cmp = Base.createElement(
        new CommentOperatorStatement("a", body, 0)
      );

      expect(cmp.elementList.map((e) => e.toString())).toMatchInlineSnapshot(`
        Array [
          "CommentOperatorStatement (0, 25): \\"VAL1 ===   obj.a.b.VAL2 #\\"",
          "StatementObject<NameInstance> (0, 4): \\"VAL1\\"",
          "Space (4, 5): \\" \\"",
          "StatementObject<StrictEqualitySymbol> (5, 8): \\"===\\"",
          "Space (8, 11): \\"   \\"",
          "StatementObject<NameInstance> (11, 23): \\"obj.a.b.VAL2\\"",
          "Space (23, 24): \\" \\"",
        ]
      `);
    });

    it("should parse end parsing comment code", () => {
      const body = b("#! if true\nFOO=bar");

      const cmp = Base.createElement(new CommentOperator("a", body, 0));

      // expect(cmp).toMatchInlineSnapshot(`Object {}`)
      expect(cmp.operator.raw.toString()).toEqual("if");
      // console.log(cmp)
    });

    it("should read property list children", () => {
      const [fl, body] = takeDemoFile();

      const envuseFileParser = new DataSource(fl, body);

      const b = envuseFileParser.toAstBody();

      for (const elem of b.elementList) {
        expect(elem).toBeInstanceOf(Base);
      }

      expect(
        b.elementList.map((e) => `${e.constructor.name} <${e.pos}, ${e.end}>`)
      ).toMatchInlineSnapshot(`
        Array [
          "Block <0, 35>",
          "Variable <0, 8>",
          "VariableKey <0, 3>",
          "SymbolEqual <3, 4>",
          "VariableValue <4, 8>",
          "CommentOperator <8, 34>",
          "Space <10, 11>",
          "VariableKey <11, 13>",
          "Space <13, 14>",
          "CommentOperatorStatement <14, 19>",
          "StatementObject <14, 18>",
          "Block <19, 34>",
          "SpaceNewLine <19, 20>",
          "Variable <20, 28>",
          "VariableKey <20, 23>",
          "SymbolEqual <23, 24>",
          "VariableValue <24, 28>",
          "SpaceNewLine <28, 29>",
          "CommentOperator <29, 34>",
          "Space <31, 32>",
          "VariableKey <32, 34>",
          "SpaceNewLine <34, 35>",
        ]
      `);
    });

    it("should parse comment operator correctly", () => {
      expect(
        DataSource.createDataSource({
          filename: null,
          body: Buffer.from(`#;if a.b.c.d ===\nfoo="bar"\n#;fi\n`),
        }).elementList.map((e) => e.toString())
      ).toMatchSnapshot();
      expect(
        DataSource.createDataSource({
          filename: null,
          body: Buffer.from(`#;if true\nfoo="bar"\n#;fi\n`),
        }).elementList.map((e) => e.toString())
      ).toMatchSnapshot();
      expect(
        DataSource.createDataSource({
          filename: null,
          body: Buffer.from(`#;if 123\nfoo="bar"\n#;fi\n`),
        }).elementList.map((e) => e.toString())
      ).toMatchSnapshot();
      expect(
        DataSource.createDataSource({
          filename: null,
          body: Buffer.from(`#;if var\nfoo="bar"\n#;fi\n`),
        }).elementList.map((e) => e.toString())
      ).toMatchSnapshot();
      expect(
        DataSource.createDataSource({
          filename: null,
          body: Buffer.from(`#;if foo === bar\nfoo="bar"\n#;fi\n`),
        }).elementList.map((e) => e.toString())
      ).toMatchSnapshot();
    });

    it("should parse block descriptive comment", () => {
      const [fl, demo] = takeDemoFile()

      const envuseFileParser = DataSource.createDataSource({ filename: fl, body: demo });

      expect(envuseFileParser).toMatchInlineSnapshot();
    });
  });
});

describe("DataSource file parse", () => {
  it("parse file", () => {
    const res = DataSource.parse({ body: b(`foo=var\nabc=def\naaa=32`) });

    expect(res.parsed).toEqual({
      foo: "var",
      abc: "def",
      aaa: "32",
    });
  });

  it("should parse with mixing conditionals", () => {
    const res1 = DataSource.parse({
      body: b(`foo=var\nabc=def\naaa=32\n#; if true\nbbb=ccc\n#; fi`),
    });

    expect(res1.parsed).toEqual({
      foo: "var",
      abc: "def",
      aaa: "32",
      bbb: "ccc",
    });

    const res2 = DataSource.parse({
      body: b(`foo=var\nabc=def\naaa=32\n#; if false\nbbb=ccc\n#; fi`),
    });

    expect(res2.parsed).toEqual({
      foo: "var",
      abc: "def",
      aaa: "32",
    });

    const res3 = DataSource.parse({
      body: b(
        `aaa=aaa\n#; if true\nbbb=bbb\n#; if false\nccc=ccc\n#; fi\n#; fi`
      ),
    });

    expect(res3.parsed).toEqual({
      aaa: "aaa",
      bbb: "bbb",
    });

    const res4 = DataSource.parse({
      body: b(
        `aaa=aaa\n#; if false\nbbb=bbb\n#; if true\nccc=ccc\n#; fi\n#; fi`
      ),
    });

    expect(res4.parsed).toEqual({
      aaa: "aaa",
    });
  });

  describe("complex sentences", () => {
    it("should parse with complex sentences (booleans)", () => {
      const res = DataSource.parse({
        body: b(`#; if true === true\naaa=aaa\n#; fi`),
      });

      expect(res.parsed).toStrictEqual({
        aaa: "aaa",
      });
    });

    it("should parse with complex sentences (booleans)", () => {
      const res = DataSource.parse({
        body: b(`bbb=bbb\n#; if true === true === false\naaa=aaa\n#; fi`),
      });

      expect(res.parsed).toStrictEqual({
        bbb: "bbb",
      });
    });

    it("should parse with complex sentences (strings)", () => {
      const res = DataSource.parse({
        body: b(`aaa=aaa\n#; if 'aaa' === 'aaa'\nbbb=bbb\n#; fi`),
      });

      expect(res.parsed).toStrictEqual({
        aaa: "aaa",
        bbb: "bbb",
      });
    });

    it("should parse with complex sentences (strings)", () => {
      const res = DataSource.parse({
        body: b(`aaa=aaa\n#; if 'ccc' === 'aaa'\nbbb=bbb\n#; fi`),
      });

      expect(res.parsed).toStrictEqual({
        aaa: "aaa",
      });
    });

    it("should parse with complex sentences (booleans)", () => {
      const res = DataSource.parse({
        body: b(`aaa=aaa\n#; if 12 === 12\nbbb=bbb\n#; fi`),
      });

      expect(res.parsed).toStrictEqual({
        aaa: "aaa",
        bbb: "bbb",
      });
    });

    it("should parse with complex sentences (booleans)", () => {
      const res = DataSource.parse({
        body: b(`aaa=aaa\n#; if 13_3 === 12\nbbb=bbb\n#; fi`),
      });

      expect(res.parsed).toStrictEqual({
        aaa: "aaa",
      });
    });

    it("should parse with complex sentences (name instance)", () => {
      const res = DataSource.parse({
        body: b(`aaa=aaa\n#; if 'aaa' === aaa\nbbb=bbb\n#; fi`),
      });

      expect(res.parsed).toStrictEqual({
        aaa: "aaa",
        bbb: "bbb",
      });
    });

    it("should parse with complex sentences (name instance)", () => {
      const res = DataSource.parse({
        body: b(`aaa=aaa\n#; if 'ccc' === aaa\nbbb=bbb\n#; fi`),
      });

      expect(res.parsed).toStrictEqual({
        aaa: "aaa",
      });
    });

    it("should parse with complex sentences (name instance and values)", () => {
      const res = DataSource.parse(
        { body: b(`aaa=aaa\n#; if 'ccc' === externalVal\nbbb=bbb\n#; fi`) },
        { externalVal: "ccc" }
      );

      expect(res.parsed).toStrictEqual({
        aaa: "aaa",
        bbb: "bbb",
      });
    });
  });
});

describe("DataSource file stringify", () => {
  it("should stringify ast", () => {
    const ast = DataSource.createDataSource(b(`foo=bar`));

    const str = JSON.stringify(ast, null, 2);

    expect(str).toMatchInlineSnapshot(`
      "{
        \\"$type\\": \\"Block\\",
        \\"pos\\": 0,
        \\"end\\": 7,
        \\"children\\": [
          {
            \\"$type\\": \\"Variable\\",
            \\"pos\\": 0,
            \\"end\\": 7,
            \\"keyVariable\\": {
              \\"$type\\": \\"VariableKey\\",
              \\"pos\\": 0,
              \\"end\\": 3,
              \\"value\\": \\"foo\\"
            },
            \\"valueVariable\\": {
              \\"$type\\": \\"VariableValue\\",
              \\"pos\\": 4,
              \\"end\\": 7,
              \\"value\\": \\"bar\\"
            }
          }
        ]
      }"
    `);
  });

  it("should stringify ast", () => {
    // const ast = EnvuseFileParser.parseToAst(b('a=b\n#; if true\nc=d\n#; fi'))
    const ast = DataSource.createDataSource(b("#; if true\n#; fi"));

    const str = JSON.stringify(ast, null, 2);

    expect(str).toMatchInlineSnapshot(`
      "{
        \\"$type\\": \\"Block\\",
        \\"pos\\": 0,
        \\"end\\": 16,
        \\"children\\": [
          {
            \\"$type\\": \\"CommentOperator\\",
            \\"pos\\": 0,
            \\"end\\": 16,
            \\"operator\\": {
              \\"$type\\": \\"VariableKey\\",
              \\"pos\\": 3,
              \\"end\\": 5,
              \\"value\\": \\"if\\"
            },
            \\"statement\\": {
              \\"$type\\": \\"CommentOperatorStatement\\",
              \\"pos\\": 6,
              \\"end\\": 11,
              \\"statements\\": [
                {
                  \\"$type\\": \\"StatementObject\\",
                  \\"pos\\": 6,
                  \\"end\\": 10,
                  \\"type\\": \\"Boolean\\",
                  \\"value\\": true
                }
              ]
            },
            \\"block\\": {
              \\"$type\\": \\"Block\\",
              \\"pos\\": 11,
              \\"end\\": 16,
              \\"children\\": [
                {
                  \\"$type\\": \\"CommentOperator\\",
                  \\"pos\\": 11,
                  \\"end\\": 16,
                  \\"operator\\": {
                    \\"$type\\": \\"VariableKey\\",
                    \\"pos\\": 14,
                    \\"end\\": 16,
                    \\"value\\": \\"fi\\"
                  }
                }
              ]
            }
          }
        ]
      }"
    `);
  });
});
