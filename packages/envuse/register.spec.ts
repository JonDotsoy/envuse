import fs from 'fs'
import childProcess from 'child_process'

// describe test with title "Register env use"
describe("Register envuse", () => {
  const folderEnvironmentTest1 = `${__dirname}/.environment/test1`;
  const fileScriptDemo = `${folderEnvironmentTest1}/console.log.js`;

  beforeAll(() => {
    fs.mkdirSync(folderEnvironmentTest1, { recursive: true })

    fs.writeFileSync(`${folderEnvironmentTest1}/.envuse`, `TEST=test1`)
    
    fs.writeFileSync(fileScriptDemo, `console.log(process.env["TEST"])`)
  });

  it('should register load env', () => {

    const process = childProcess.spawnSync('node', [
      '-r', 'ts-node/register',
      '-r', `${__dirname}/register.ts`,
      fileScriptDemo,
    ], {
      cwd: folderEnvironmentTest1,
    });

    expect(process.stderr.toString()).toBe('');

    const out = Buffer.concat(
      process.output
        .filter(
          (data): data is string => data !== null
        )
        .map((data: any) => {
          if (data instanceof Buffer) {
            return data
          } else {
            return Buffer.from(data)
          }
        })
    ).toString()

    expect(out).toBe('test1\n');

  })

});
