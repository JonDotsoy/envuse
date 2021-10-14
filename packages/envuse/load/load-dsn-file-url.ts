import { URL } from "url";
import { DataSource } from "../data-source/data-source";
import path from "path";
import { loadResult } from "./load-result";
import { LoadOptions } from "./types/load-options";
import { fsReadFile } from "./load";
import debug from "debug";

const log = debug("envuse:load:load-dsn-file-url");

export async function loadDsnFileUrl(
  dsn: URL,
  options: LoadOptions
): Promise<loadResult> {
  const ignoreTypeValidation = options.ignoreTypeValidation || false;

  log(`Pull configuration`);
  const l = (v: string) => v.padStart(15, " ");
  log(`${l(`Download DSN`)}: ${dsn.href}`);

  const downloadStart = Date.now();
  const buff = await fsReadFile(dsn);
  const downloadEnd = Date.now();
  const downloadDurationSec = ((downloadEnd - downloadStart) / 1000).toFixed(3);
  log(`Done downloading in ${downloadDurationSec}s`);

  if (!ignoreTypeValidation) {
    const extname = path.extname(dsn.pathname).toLowerCase();
    const filename = path.basename(dsn.pathname).toLowerCase();
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
    dsn: dsn.href,
    data: buff,
  };
}
