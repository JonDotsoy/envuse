import { deepEqual } from "node:assert";
import * as t from "node:test";
import { pathToFileURL } from "node:url";
import { Workspace } from "./utils/workspace";

t.test("should evaluate support with dotenv", async () => {
  const w = new Workspace(
    new URL(".__demos__/workspace1/", pathToFileURL(__filename))
  );

  await w.file(".envuse")`
    ABC:number
  `;
  await w.file(".env")`
    ABC=123
  `;
  await w.file("index.ts")`
    import { e } from "../../../src/index";

    console.log(${"`::set-output:configs:${JSON.stringify(e)}`"});
  `;

  const { output } = await w.runTs("index.ts", { env: { ABC: "12" } });

  deepEqual(output.configs, {
    ABC: 123,
  });
});
