import { Cli } from "./libs/cli";
import { ExportCmd } from "./libs/cli_cmds/export.cmd";
import { RunCmd } from "./libs/cli_cmds/run.cmd";

describe("cli", () => {
  it("should parse run command", async () => {
    const cli = new Cli();
    cli.use(new RunCmd());

    const parsed = cli.parse("run");

    expect(parsed).toMatchInlineSnapshot(`
      CommandMatch {
        "args": Array [],
        "kind": RunCmd {
          "match": /\\^run\\$/,
        },
        "options": Object {
          "argsWithoutOptions": Array [],
          "options": Object {},
        },
      }
    `);
  });

  it.only("should parse export with args", () => {
    const cli = new Cli();
    cli.use(new ExportCmd());

    const parsed = cli.parse("export", "--out", "./out.js", "--format", "json");

    console.log(parsed);
  });
});
