import { URL } from "url";
import fs from "fs";
import { promisify } from "util";
import { LoadOptions } from "./load-options";
import { loadDsnUrl } from "./load-dsn-url";
import { loadDsnFilePath } from "./load-dsn-file-path";
import { loadDsnFileUrl } from "./load-dsn-file-url";
import { loadResult } from "./load-result";
import { DataSource } from "../data-source/data-source";
import debug from "debug";

const log = debug("envuse:load");

export const fsReadFile = promisify(fs.readFile);

enum dsnTypes {
  url,
  fileUrl,
  filePath,
}

function getTypeDsn(dsnString: string) {
  if (dsnString.startsWith("http:")) return dsnTypes.url;
  if (dsnString.startsWith("https:")) return dsnTypes.url;
  if (dsnString.startsWith("file:")) return dsnTypes.fileUrl;
  return dsnTypes.filePath;
}

function loadFactory(options: LoadOptions): Promise<loadResult> {
  const dsnType = getTypeDsn(options.dsn);

  switch (dsnType) {
    case dsnTypes.url:
      return loadDsnUrl(new URL(options.dsn), options);
    case dsnTypes.fileUrl:
      return loadDsnFileUrl(new URL(options.dsn), options);
    case dsnTypes.filePath:
      return loadDsnFilePath(options.dsn, options);
    default:
      throw new Error(`Unsupported dsn type: ${dsnType}`);
  }
}

/**
 * Loads the envuse file and returns the data source.
 */
export async function loadData(options: LoadOptions) {
  return loadFactory(options);
}

/**
 * Loads the envuse file and returns the data source.
 */
export async function load(options: LoadOptions) {
  const res = await loadFactory(options);

  return {
    dsn: res.dsn,
    data: res.data,
    ...DataSource.parse(res.data),
  };
}
