import type { DataSource } from "./data-source/data-source";
import fs from "fs";
export type { EnvuseDefinition } from "./envuse-definition";
const pathEnvuseDefinition = `${__dirname}/envuse-definition.d.ts`;

type DataSourceParsed = ReturnType<typeof DataSource["parse"]>;

declare global {
  module NodeJS {
    interface Global {
      envuseDataSourceParsed?: DataSourceParsed;
    }
  }
}

const toTypeTs = (type: string) => {
  switch (type) {
    case "string":
      return "string";
    case "number":
      return "number";
    case "boolean":
      return "boolean";
    default:
      return "unknown";
  }
};

export const createTypeScriptDefinition = (
  dataSourceParsed?: DataSourceParsed
) => {
  let buf = "";

  buf += `/*\n`;
  buf += `  This file is automatically generated by envuse. Please do not edit.\n`;
  buf += `*/\n\n`;
  buf += `export interface EnvuseDefinition {\n\n`;

  if (dataSourceParsed) {
    for (let [key, def] of Object.entries(dataSourceParsed.definitions)) {
      if (def?.description) {
        buf += `/**\n${def.description}\n*/\n`;
      }

      if (def?.type) buf += `${key}: ${toTypeTs(def.type)};\n`;
    }
  }

  buf += `\n`;
  buf += `[k: string]: any;\n`;

  buf += `}\n`;

  fs.writeFileSync(pathEnvuseDefinition, buf);
};

export default {};
