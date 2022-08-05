import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { mkdir, readFile, rmdir, unlink, writeFile } from "node:fs/promises";
import * as t from "node:test";
import { inspect } from "node:util";
import { configContext } from "../src/config";
import { lines } from "./utils/lines";

t.test(
  "should calling the config flow under a directory with an envuse file",
  async () => {
    const dirTest = `${__dirname}/.demos/test1`;

    // @ts-ignore
    const ctx = configContext<import("./.demos/test1/configs").listConfigTypes>(
      {
        locationTypes: `${dirTest}/configs.ts`,
      }
    );

    await mkdir(dirTest, { recursive: true });
    process.chdir(dirTest);
    await writeFile(`${dirTest}/.gitkeep`, "");

    await writeFile(
      `${dirTest}/.envuse`,
      lines`
    # Comment
    AAA: string
    BBB: number
  `
    );

    const a = ctx.config(".envuse", {
      originConfigs: { AAA: "s", BBB: "123" },
    });

    assert.deepStrictEqual(a, {
      config: { BBB: 123, AAA: "s" },
    });

    assert.equal(
      await readFile(`${dirTest}/configs.ts`, "utf-8"),
      lines`
    /** @declaration {"configTypes":{".envuse":{"variables":{"AAA":{"type":"string","value_template":null,"_node":null},"BBB":{"type":"number","value_template":null,"_node":null}}}}} */

    export type listConfigTypes =
      {
        ".envuse": 
          {
            "AAA": string
            "BBB": number
          }

      }

  `
    );
  }
);

t.test(
  "should calling the config flow under a directory with an envuse file",
  async () => {
    const dirTest = `${__dirname}/.demos/test2`;

    // @ts-ignore
    const ctx = configContext<import("./.demos/test2/configs").listConfigTypes>(
      {
        locationTypes: `${dirTest}/configs.ts`,
      }
    );

    await mkdir(dirTest, { recursive: true });
    process.chdir(dirTest);
    await writeFile(`${dirTest}/.gitkeep`, "");

    const a = ctx.config(".envuse", {
      originConfigs: { AAA: "s", BBB: "123" },
    });

    assert.deepStrictEqual(a, { config: {} });

    assert.equal(
      await readFile(`${dirTest}/configs.ts`, "utf-8"),
      lines`
    /** @declaration {"configTypes":{".envuse":{"variables":{}}}} */

    export type listConfigTypes =
      {
        ".envuse": 
          {
          }

      }

  `
    );
  }
);
