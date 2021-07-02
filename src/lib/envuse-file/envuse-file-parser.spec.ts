import { EnvuseFileParser } from "./envuse-file-parser";
import { takeDemoFile } from "./takeDemoFile";
import util from 'util'

describe('EnvuseFileParser2', () => {

  it('shoud make a ast out', () => {
    const [filename1, body1] = takeDemoFile('.env');
    const [filename2, body2] = takeDemoFile('.env');

    const envuseFileParser = new EnvuseFileParser(filename1, body1);
    console.log(
      util.formatWithOptions({ depth: Infinity, colors: true }, '', envuseFileParser.toAstBody())
    )
  })

})
