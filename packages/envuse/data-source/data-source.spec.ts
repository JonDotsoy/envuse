import { DataSource } from "./data-source";
import { takeDemoFile } from "./statements/lib/take-demo-file";
import util, { inspect } from "util";
import { CommentOperator } from "./statements/components/comment-operator";
import { CommentOperatorStatement } from "./statements/components/comment-operator-statement";
import { StatementObject } from "./statements/components/statement-object";
import { Base } from "./statements/components/base";
import { b } from "./statements/lib/to-buffer";
import { Console } from "console";

describe("DataSource", () => {
  it("shoud make a ast out", () => {
    const [filename1, body1] = takeDemoFile();

    const envuseFileParser = DataSource.createDataSource({
      filename: filename1,
      body: body1,
    });
    expect(
      util.formatWithOptions({ depth: Infinity }, "", envuseFileParser)
    ).toMatchSnapshot();
  });

  it("shoud make a ast with operators", () => {
    const [filename, body] = takeDemoFile();

    const envuseFileParser = DataSource.createDataSource({ filename, body });
    expect(
      util.formatWithOptions({ depth: Infinity }, "", envuseFileParser)
    ).toMatchSnapshot();
    // console.log(util.formatWithOptions({ depth: Infinity }, '', envuseFileParser.toAstBody()))
  });

  it("shoud make a ast with multiple blocks", () => {
    const [filename, body] = takeDemoFile(".env");

    const envuseFileParser = DataSource.createDataSource({ filename, body });
    expect(
      util.formatWithOptions({ depth: Infinity }, "", envuseFileParser)
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

      expect(cmp.elementList.map((e) => e.toString())).toMatchSnapshot();
    });

    it("should parse end parsing comment code", () => {
      const body = b("#! if true\nFOO=bar");

      const cmp = Base.createElement(new CommentOperator("a", body, 0));

      // expect(cmp).toMatchSnapshot(`Object {}`)
      expect(cmp.operator.raw.toString()).toEqual("if");
      // console.log(cmp)
    });

    it("should read property list children", () => {
      const [fl, body] = takeDemoFile();

      const envuseFileParser = DataSource.createDataSource({
        filename: fl,
        body,
      });

      const b = envuseFileParser;

      for (const elem of b.elementList) {
        expect(elem).toBeInstanceOf(Base);
      }

      expect(
        b.elementList.map((e) => `${e.constructor.name} <${e.pos}, ${e.end}>`)
      ).toMatchSnapshot();
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
      const [fl, demo] = takeDemoFile();

      const envuseFileParser = DataSource.createDataSource({
        filename: fl,
        body: demo,
      });

      // inspect envuseFileParser
      expect(inspect(envuseFileParser.elementList)).toMatchSnapshot(`
        "[
          Block (0, 47): \\"# single ...
            CommentInline (0, 18): \\"# single comment\\\\n\\"
            SpaceNewLine (18, 19): \\"\\\\n\\"
            BlockComment (19, 33): \\"###\\\\nNo 123\\\\n###\\"
            SpaceNewLine (33, 39): \\"    \\\\n\\\\n\\"
            Variable (39, 47): \\"FOO=BAR\\\\n...
              ...,
          CommentInline (0, 18): \\"# single comment\\\\n\\",
          SpaceNewLine (18, 19): \\"\\\\n\\",
          BlockComment (19, 33): \\"###\\\\nNo 123\\\\n###\\",
          SpaceNewLine (33, 39): \\"    \\\\n\\\\n\\",
          Variable (39, 47): \\"FOO=BAR\\\\n...
            VariableKey (39, 42): \\"FOO\\"
            SymbolEqual (42, 43): \\"=\\"
            VariableValue (43, 46): \\"BAR\\",
          VariableKey (39, 42): \\"FOO\\",
          SymbolEqual (42, 43): \\"=\\",
          VariableValue (43, 46): \\"BAR\\"
        ]"
      `);
    });

    it("should parse variable with type", () => {
      const buff = Buffer.from(`FOO : number = 123`);

      const envuseParser = DataSource.createDataSource(buff);

      expect(inspect(envuseParser.elementList)).toMatchSnapshot();
    });

    it("should parse variable with comment", () => {
      const buff = Buffer.from(`FOO : number = "123" # comment`);

      const envuseParser = DataSource.createDataSource(buff);

      expect(inspect(envuseParser.elementList)).toMatchSnapshot();
    });

    it("should parse variable with comment reject by new line", () => {
      const buff = Buffer.from(`FOO : number = "12\n3" # comment`);

      expect(() => DataSource.createDataSource(buff)).toThrowError();
    });

    it("should parse variable with comment", () => {
      const buff = Buffer.from(`FOO : number = '12#3' # comment`);

      const envuseParser = DataSource.createDataSource(buff);

      expect(inspect(envuseParser.elementList)).toMatchSnapshot();
    });

    it("should parse variable with comment", () => {
      const buff = Buffer.from(`FOO : number = HOLA HI    # comment`);

      const envuseParser = DataSource.createDataSource(buff);

      // console.log(inspect(envuseParser.elementList))
      expect(inspect(envuseParser, { depth: Infinity })).toMatchSnapshot();
    });

    it("should parse variable with comment", () => {
      const buff = Buffer.from(
        `FOO : number = HOLA HI    # comment\nA='B#'#sa`
      );

      const envuseParser = DataSource.createDataSource(buff);

      // console.log(inspect(envuseParser.elementList))
      expect(inspect(envuseParser, { depth: Infinity })).toMatchSnapshot();
    });
  });

  it("should parse variable with backslash", () => {
    const buff = Buffer.from(`A='\\''\n`);

    const envuseParser = DataSource.createDataSource(buff);

    // console.log(inspect(envuseParser.elementList))
    expect(inspect(envuseParser, { depth: Infinity })).toMatchSnapshot();
  });

  it("should parse variable with backslash", () => {
    const buff = Buffer.from(`A="\\""\n`);

    const envuseParser = DataSource.createDataSource(buff);

    // console.log(inspect(envuseParser.elementList))
    expect(inspect(envuseParser, { depth: Infinity })).toMatchSnapshot();
  });

  it("should parse data source full demo", () => {
    const [fl, buff] = takeDemoFile();

    expect(() => {
      DataSource.createDataSource({
        filename: fl,
        body: buff,
      });
    }).not.toThrowError();

    // console.log(inspect(envuseFileParser.elementList))

    // expect(inspect(envuseFileParser.elementList)).toMatchSnapshot();
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

    expect(str).toMatchSnapshot();
  });

  it("should stringify ast", () => {
    // const ast = EnvuseFileParser.parseToAst(b('a=b\n#; if true\nc=d\n#; fi'))
    const ast = DataSource.createDataSource(b("#; if true\n#; fi"));

    const str = JSON.stringify(ast, null, 2);

    expect(str).toMatchSnapshot();
  });

  it("should parse envuse file and return definition", () => {
    const [fl, buf] = takeDemoFile();

    const a = DataSource.parse({
      filename: fl,
      body: buf,
    });

    expect(inspect(a.definitions)).toMatchSnapshot();
  });

  it("should compile custom type", () => {
    const [fl, buf] = takeDemoFile();

    const a = DataSource.parse({
      filename: fl,
      body: buf,
      customTypes: [
        {
          type: "custom_js",
          parser: (ctx) => {
            return eval(`(${ctx.valueStr})`);
          },
        },
      ],
    });

    expect(inspect(a.definitions)).toMatchSnapshot();
  });
});
