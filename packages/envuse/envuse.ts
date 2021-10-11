import fs from "fs";
import { DataSource, Option, Values } from "./data-source/data-source";
import { BlockType } from "./data-source/statements/components/block";
import { SymbolEqual } from "./data-source/statements/components/symbol-equal";
import { Variable } from "./data-source/statements/components/variable";
import { defaultEnvuseFilepath } from "./constants/default-envuse-filepath";
import { defaultLockEnvuseFilepath } from "./constants/default-lock-envuse-filepath";
import {
  createTypeScriptDefinition,
  EnvuseDefinition,
} from "./global-envuse-loaded";

const variableLoader: { [k: string]: any } = {};

/**
 * Load file .envuse or file defined on process.env.ENVUSE_FILE_PATH and put
 * values in to process.env
 *
 * Make a lock file with the sample file and definition of .envuse file.
 *
 * @hidden
 */
export const register = (opts?: {
  filepath?: string;
  lockFilepath?: string;
}) => {
  const filepath = opts?.filepath ?? defaultEnvuseFilepath;
  const lockFilepath = opts?.lockFilepath ?? defaultLockEnvuseFilepath;

  if (filepath) {
    const r = DataSource.parseFile(filepath, process.env);
    const { definitions, parsed, ast } = r;

    global.envuseDataSourceParsed = r;

    for (const [key, { value }] of Object.entries(definitions)) {
      variableLoader[key] = value;
    }

    createTypeScriptDefinition(r);

    // Check if not there is a lock file
    if (!fs.existsSync(lockFilepath)) {
      const bodyLock: number[] = [...ast.body];
      ast.elementList.map((el) => {
        if (el instanceof Variable) {
          const pos =
            el.elementList.find((el) => el instanceof SymbolEqual)?.pos ??
            el.valueVariable.pos;
          bodyLock.fill(0, pos, el.valueVariable.end);
        }
      });
      fs.writeFileSync(
        lockFilepath,
        Buffer.from(bodyLock.filter((e) => e !== 0))
      );
    }

    for (const key in parsed) {
      if (parsed.hasOwnProperty(key)) {
        process.env[key] = parsed[key];
      }
    }
  }
};

export const parse = (option: Option, values?: Values) => {
  return DataSource.parse(option, values);
};

export const parseFile = (filepath: string, values: Values) => {
  return DataSource.parseFile(filepath, values);
};

export const createDataSource = (option: Option) => {
  return DataSource.createDataSource(option);
};

export const stringify = (comp: BlockType) => {
  return DataSource.stringify(comp);
};

export default variableLoader as EnvuseDefinition;
