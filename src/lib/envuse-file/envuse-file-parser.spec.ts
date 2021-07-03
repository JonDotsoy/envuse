import { EnvuseFileParser } from "./envuse-file-parser";
import { takeDemoFile } from "./statements/takeDemoFile";
import util from 'util'

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

})
