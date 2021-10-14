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
  });
});
