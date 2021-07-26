import fs from "fs";
import { DataSource, Option, Values } from "./data-source/data-source";
import { BlockType } from "./data-source/statements/comps/Block";
import { SymbolEqual } from "./data-source/statements/comps/SymbolEqual";
import { VariableValue } from "./data-source/statements/comps/VariableValue";
import { prepareTypeScriptDefinition, EnvuseDefinition } from "./global-envuse-loaded";

const variableLoader: { [k: string]: any } = {}

// ensure filepath is a file or return null
const f = (filepath?: string) => {
  if (filepath && fs.existsSync(filepath) && fs.statSync(filepath).isFile()) {
    return filepath;
  }
  return null;
};


export const defaultFilepath =
  f(process.env.ENVUSE_FILE_PATH) ?? f(`${process.cwd()}/.envuse`);

export const defaultLockFilepath =
  f(process.env.ENVUSE_LOCK_FILE_PATH) ?? `${process.cwd()}/.envuse-lock`;


/**
 * Load file .envuse or file defined on process.env.ENVUSE_FILE_PATH and put
 * values in to process.env
 * 
 * Make a lock file with the sample file and definition of .envuse file.
 * 
 * @hidden
 */
export const register = (opts?: { filepath?: string, lockFilepath?: string }) => {
  const filepath = opts?.filepath ?? defaultFilepath;
  const lockFilepath = opts?.lockFilepath ?? defaultLockFilepath;

  if (filepath) {
    const r = DataSource.parseFile(filepath, process.env);
    const { definitions, parsed, ast } = r

    global.envuseDataSourceParsed = r;

    for (const [key, { value }] of Object.entries(definitions)) {
      variableLoader[key] = value;
    }

    prepareTypeScriptDefinition(r);

    const bodyLock: number[] = [...ast.body]
    ast.elementList.map(el => {
      if (el instanceof SymbolEqual || el instanceof VariableValue) {
        bodyLock.fill(0, el.pos, el.end)
      }

      // bodyLock.push(...ast.body.subarray(el.pos, el.end))

    })
    fs.writeFileSync(lockFilepath, Buffer.from(bodyLock.filter(e => e !== 0)));

    for (const key in parsed) {
      if (parsed.hasOwnProperty(key)) {
        process.env[key] = parsed[key];
      }
    }
  }
};

export const parse = (option: Option, values?: Values) => {
  return DataSource.parse(option, values);
}

export const parseFile = (filepath: string, values: Values) => {
  return DataSource.parseFile(filepath, values);
}

export const createDataSource = (option: Option) => {
  return DataSource.createDataSource(option);
}

export const stringify = (comp: BlockType) => {
  return DataSource.stringify(comp);
}

export default variableLoader as EnvuseDefinition;
