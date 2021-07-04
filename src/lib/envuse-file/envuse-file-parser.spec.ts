import { EnvuseFileParser } from "./envuse-file-parser";
import { takeDemoFile } from "./statements/takeDemoFile";
import util from 'util'
import { CommentOperator, CommentOperatorStatement } from "./statements/CommentOperator";
import { Base } from "./statements/Base";

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

    it.only('should parse statement with numbers' , () => {
      const body = Buffer.from('34214324 ===   22_343.32 # comment');

      const cmp = Base.createElement(new CommentOperatorStatement('a', body, 0))

      // expect(cmp).toMatchSnapshot()
      console.log(cmp)
    })

  })

})
