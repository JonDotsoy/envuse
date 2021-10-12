import { DataSource } from "../data-source/data-source";
import fs from "fs";
import path from "path";
import { loadResult } from "./load-result";
import { LoadOptions } from "./load-options";
import { fsReadFile } from "./load";

export async function loadDsnFilePath(
  dsn: string,
  options: LoadOptions
): Promise<loadResult> {
  const ignoreTypeValidation = options.ignoreTypeValidation || false;
  const buff = await fsReadFile(dsn);

  if (!fs.existsSync(dsn)) {
    throw new Error(`File does not exist: ${dsn}`);
  }

  if (!fs.statSync(dsn).isFile()) {
    throw new Error(`Path is not a file: ${dsn}`);
  }

  if (!ignoreTypeValidation) {
    const extname = path.extname(dsn).toLowerCase();
    const filename = path.basename(dsn).toLowerCase();
    if (extname) {
      if (extname !== ".envuse") {
        throw new Error(
          `Expected file extension to be .envuse, got ${extname}`
        );
      }
    } else if (filename !== ".envuse") {
      throw new Error(`Expected file name to be .envuse, got ${filename}`);
    }
  }

  return {
    dsn: dsn,
    ...DataSource.parse(buff),
  };
}
