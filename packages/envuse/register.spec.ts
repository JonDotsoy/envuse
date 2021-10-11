import fs from "fs";
import childProcess from "child_process";
import { takeDemoFile } from "./data-source/statements/lib/take-demo-file";

// describe test with title "Register env use"
describe("Register envuse", () => {
  const folderEnvironmentTest1 = `${__dirname}/.__environment_demo__/test1`;
  const fileScriptDemo = `${folderEnvironmentTest1}/console.log.js`;
  const fileEnvuse = `${folderEnvironmentTest1}/.envuse`;
  const fileEnvuseLock = `${folderEnvironmentTest1}/.envuse-lock`;

  beforeAll(() => {
    // files to remove
    const filesToRemove = [fileScriptDemo, fileEnvuse, fileEnvuseLock];

    // remove files
    filesToRemove.forEach((file) => {
      if (fs.existsSync(file)) {
        fs.unlinkSync(file);
      }
    });

    const [_fl, body] = takeDemoFile("Register: Demo Envuse");

    fs.mkdirSync(folderEnvironmentTest1, { recursive: true });
    fs.writeFileSync(fileEnvuse, body);
    fs.writeFileSync(fileScriptDemo, `console.log(process.env["API_KEY"])`);
  });

  it("should register load env", () => {
    const process = childProcess.spawnSync(
      "node",
      [
        "-r",
        "ts-node/register",
        "-r",
        `${__dirname}/register.ts`,
        fileScriptDemo,
      ],
      {
        cwd: folderEnvironmentTest1,
      }
    );

    expect(process.stderr.toString()).toBe("");

    const out = Buffer.concat(
      process.output
        .filter((data): data is string => data !== null)
        .map((data: any) => {
          if (data instanceof Buffer) {
            return data;
          } else {
            return Buffer.from(data);
          }
        })
    ).toString();

    expect(out).toBe("cf7d6f43-bb85-4045-a23f-7fb94bfac745\n");

    expect(fs.readFileSync(fileEnvuseLock, "utf8")).toMatchInlineSnapshot(`
      "# .envuse
      ##############################
      # Demo file for .envuse
      ##############################

      ###
      # Comment descriptive
      ###
      API_KEY            # API key UUIDv4
      DB_HOST           
      DB_PORT : number   # Database port
      DB_USER           
      DB_PASSWORD       
      DB_NAME           

      #; if SHELL_SYSTEM  ===  'windows'  ===  1_232.3_21_12 === A.D.V
        COLOR_TERM : boolean 

        #; if SHELL_SYSTEM  ===  'windows'  ===  1_232.3_21_12 === A.D.V
          ssl : boolean 
        #; fi

      #; fi

      #; if true
        FORCE_URL_SSL 
      #; fi

      # single comment
        A # # asd
            ###
      No 123
      ###"
    `);
  });
});
