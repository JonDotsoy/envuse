import { EnvuseFileParser } from "./envuse-file-parser";
import { takeDemoFile } from "./statements/takeDemoFile";
import util from 'util'
import { CommentOperator, CommentOperatorStatement, StatementObject } from "./statements/CommentOperator";
import { Base } from "./statements/Base";
import { toBuffer as b } from "./statements/toBuffer";

describe('EnvuseFileParser2', () => {

  it('shoud make a ast out', () => {
    const [filename1, body1] = takeDemoFile('.env');

    const envuseFileParser = new EnvuseFileParser(filename1, body1);
    expect(util.formatWithOptions({ depth: Infinity }, '', envuseFileParser.toAstBody())).toMatchSnapshot()
  })

  it('shoud make a ast with operators', () => {
    const [filename, body] = takeDemoFile('.env');

    const envuseFileParser = new EnvuseFileParser(filename, body);
    expect(util.formatWithOptions({ depth: Infinity }, '', envuseFileParser.toAstBody())).toMatchSnapshot()
    // console.log(util.formatWithOptions({ depth: Infinity }, '', envuseFileParser.toAstBody()))
  })

  it('shoud make a ast with multiple blocks', () => {
    const [filename, body] = takeDemoFile('.env');

    const envuseFileParser = new EnvuseFileParser(filename, body);
    expect(util.formatWithOptions({ depth: Infinity }, '', envuseFileParser.toAstBody())).toMatchSnapshot()
    // console.log(util.formatWithOptions({ depth: Infinity }, '', envuseFileParser.toAstBody()))
  })

  describe('parse statement', () => {

    it('parse statement operation', () => {
      const body = Buffer.from('true ===   false # asd');

      const cmp = Base.createElement(new CommentOperatorStatement('a', body, 0))

      expect(cmp).toMatchSnapshot()
    })

    it('should parse statement with numbers', () => {
      const body = Buffer.from('34214324 ===   22_343.32 # comment');

      const cmp = Base.createElement(new CommentOperatorStatement('a', body, 0))

      expect(cmp).toMatchSnapshot()
      // console.log(cmp)
    })

    it('should parse StatementObject string', () => {
      const [fl, body] = takeDemoFile()

      const cmp = Base.createElement(new StatementObject(fl, body, 0))

      // expect(cmp).toMatchSnapshot()
      // console.log(cmp)
    })

    it('should parse statement with string', () => {
      const [fl, body] = takeDemoFile()

      Base.createElement(new CommentOperatorStatement(fl, body, 0))

      // expect(cmp).toMatchSnapshot()
      // console.log(cmp)
    })

    it('should parse statement with string and special characters', () => {
      const [fl, body] = takeDemoFile('.special-characters.txt')

      const cmp = Base.createElement(new StatementObject(fl, body, 0))

      // expect(cmp).toMatchSnapshot()
      console.log(cmp)
      expect(Array.from(cmp.raw)).toEqual([0x0a, 0x09])
    })

    it('should parse instance path', () => {
      const body = Buffer.from('obj.a.b.VAL2');

      const cmp = Base.createElement(new StatementObject('a', body, 0))

      expect(cmp.value).toEqual(['obj', 'a', 'b', 'VAL2'])
    })

    it('should parse numbers', () => {
      const body = b('1_321.123');

      const cmp = Base.createElement(new StatementObject('a', body, 0))

      if (cmp.type === 'Number') {
        cmp.value
      }

      expect(cmp.value).toEqual(1_321.123)
    })

    it('should parse strings', () => {
      const body = b('"hi"');

      const cmp = Base.createElement(new StatementObject('a', body, 0))

      expect(cmp.value).toEqual("hi")
    })

    it('should parse statement with variables', () => {
      const body = Buffer.from('VAL1 ===   obj.a.b.VAL2 # comment');

      const cmp = Base.createElement(new CommentOperatorStatement('a', body, 0))

      // expect(cmp).toMatchSnapshot()
      console.log(cmp)
    })

    it.only('should parse end parsing comment code', () => {
      const body = b('#! if true\nFOO=bar')

      const cmp = Base.createElement(new CommentOperator('a', body, 0))

      // expect(cmp).toMatchInlineSnapshot(`Object {}`)
      expect(cmp.operator.raw.toString()).toEqual('if')
      console.log(cmp)
    })

  })

})
