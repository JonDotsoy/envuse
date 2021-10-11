import fs from "fs";
import { DataSource, Option, Values } from "./data-source/data-source";
import { BlockType } from "./data-source/statements/comps/Block";
import { SymbolEqual } from "./data-source/statements/comps/SymbolEqual";
import { Variable } from "./data-source/statements/comps/Variable";
import {
  createTypeScriptDefinition,
  EnvuseDefinition,
} from "./global-envuse-loaded";

const variableLoader: { [k: string]: any } = {};

// ensure filepath is a file or return null
const file = (filepath?: string) => {
  if (filepath && fs.existsSync(filepath) && fs.statSync(filepath).isFile()) {
    return filepath;
  }
  return null;
};

export const defaultFilepath =
  file(process.env.ENVUSE_FILE_PATH) ?? file(`${process.cwd()}/.envuse`);

export const defaultLockFilepath =
  file(process.env.ENVUSE_LOCK_FILE_PATH) ?? `${process.cwd()}/.envuse-lock`;

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
  const filepath = opts?.filepath ?? defaultFilepath;
  const lockFilepath = opts?.lockFilepath ?? defaultLockFilepath;

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
