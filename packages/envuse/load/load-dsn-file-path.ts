import { DataSource } from "../data-source/data-source";
import fs from "fs";
import path from "path";
import { loadResult } from "./load-result";
import { LoadOptions } from "./types/load-options";
import { fsReadFile } from "./load";
import debug from "debug";

const log = debug("envuse:load:load-dsn-file-path");

export async function loadDsnFilePath(
  dsn: string,
  options: LoadOptions
): Promise<loadResult> {
  const ignoreTypeValidation = options.ignoreTypeValidation || false;

  log(`Pull configuration`);
  const l = (v: string) => v.padStart(15, " ");
  log(`${l(`Download DSN`)}: ${dsn}`);

  const downloadStart = Date.now();
  const buff = await fsReadFile(dsn);
  const downloadEnd = Date.now();
  const downloadDurationSec = ((downloadEnd - downloadStart) / 1000).toFixed(3);

  log(`Done downloading in ${downloadDurationSec}s`);

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
    data: buff,
  };
}
