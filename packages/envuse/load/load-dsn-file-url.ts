import { URL } from "url";
import { DataSource } from "../data-source/data-source";
import path from "path";
import { loadResult } from "./load-result";
import { LoadOptions } from "./load-options";
import { fsReadFile } from "./load";

export async function loadDsnFileUrl(
  dsn: URL,
  options: LoadOptions
): Promise<loadResult> {
  const ignoreTypeValidation = options.ignoreTypeValidation || false;
  const buff = await fsReadFile(dsn);

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
    ...DataSource.parse(buff),
  };
}
