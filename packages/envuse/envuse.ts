import fs from "fs";
import { DataSource } from "./data-source/data-source";

// ensure filepath is a file or return null
const f = (filepath?: string) => {
  if (filepath && fs.existsSync(filepath) && fs.statSync(filepath).isFile()) {
    return filepath;
  }
  return null;
};


export const defaultFilepath =
  f(process.env.ENVUSE_PATH) ?? f(`${process.cwd()}/.envuse`);


export const register = (opts?: { filepath: string }) => {
  const filepath = opts?.filepath ?? defaultFilepath;

  if (filepath) {
    const { parsed } = DataSource.parseFile(filepath, process.env);

    for (const key in parsed) {
      if (parsed.hasOwnProperty(key)) {
        process.env[key] = parsed[key];
      }
    }
  }
};
