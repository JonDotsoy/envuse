import { spawn, spawnSync } from "child_process";
import { mkdir, writeFile } from "fs/promises";
import { lines } from "./lines";

export class Workspace {
  constructor(private baseDirectory: URL) {}

  file(relativePath: string) {
    return async (
      template: { raw: readonly string[] | ArrayLike<string> },
      ...substitutions: any[]
    ) => {
      const filePath = new URL(relativePath, this.baseDirectory);
      await mkdir(new URL(".", filePath), { recursive: true });
      await writeFile(filePath, lines(template, ...substitutions));
    };
  }

  async runTs(
    relativePath: string,
    options?: { env?: Record<string, string | undefined> }
  ) {
    const output: Record<string, any> = {};
    const filePath = new URL(relativePath, this.baseDirectory);
    let stdoutBff: Buffer = Buffer.from([]);
    let stderrBff: Buffer = Buffer.from([]);

    const child = spawn("ts-node", [filePath.pathname], {
      cwd: this.baseDirectory,
      env: {
        ...process.env,
        ...options?.env,
      },
    });

    child.stderr.on("data", (data: Buffer) => {
      stderrBff = Buffer.concat([stderrBff, data]);
    });

    child.stdout.on("data", (data: Buffer) => {
      stdoutBff = Buffer.concat([stdoutBff, data]);

      for (const { groups } of data
        .toString("utf-8")
        .matchAll(/::set-output:(?<varname>\w+):(?<value>.+)\n/g)) {
        const varname = groups?.varname;
        const valueRaw = groups?.value;
        if (varname && valueRaw) {
          try {
            let value: any;
            try {
              value = JSON.parse(valueRaw);
            } catch {
              value = valueRaw;
            }
            output[varname] = value;
          } catch {}
        }
      }
    });

    await new Promise((resolve, reject) => {
      child.once("close", resolve);
      child.once("error", reject);
    });

    return {
      output,
      stdout: stdoutBff,
      stderr: stderrBff,
    };
  }
}
