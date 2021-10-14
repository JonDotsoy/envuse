import { URL } from "url";
import fs from "fs";
import { promisify } from "util";
import { LoadOptions } from "./types/load-options";
import { loadDsnUrl } from "./load-dsn-url";
import { loadDsnFilePath } from "./load-dsn-file-path";
import { loadDsnFileUrl } from "./load-dsn-file-url";
import { assertLoadResult, loadResult } from "./load-result";
import { DataSource } from "../data-source/data-source";
import debug from "debug";
import { dirname } from "path/posix";
import { tmpdir, type } from "os";
import { createHash } from "crypto";
import { jsonStringify } from "./json-replacer";
import { jsonParse } from "./json-reviver";
import { assert } from "console";

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
  const cacheEnabled = options.cache?.enable ?? true;
  const cacheKeyLocation =
    options.cache?.filePath ??
    `${tmpdir()}/.envuse-cache-reports/${createHash("md5")
      .update(options.dsn)
      .digest("hex")}.json`;
  const time10minutes = 600000;
  const cacheTtl = options.cache?.ttl ?? time10minutes;

  if (cacheEnabled) {
    try {
      const cachedData = await fsReadFile(cacheKeyLocation, "utf8");
      const data = jsonParse(cachedData);
      log(`Loaded data from cache: ${cacheKeyLocation}`);
      if (typeof data !== "object") {
        throw new Error(`Invalid cache data: ${cachedData}`);
      }
      if (typeof data.timestamp !== "number") {
        throw new Error(`Invalid cache data: ${cachedData}`);
      }
      if (typeof data.res !== "object") {
        throw new Error(`Invalid cache data: ${cachedData}`);
      }
      if (data.timestamp + cacheTtl > Date.now()) {
        const res = data.res;
        assertLoadResult(res);
        return res;
      }
    } catch (error) {
      log(`Cache not found: ${cacheKeyLocation}`);
    }
  }

  const res = await loadFactory(options);

  if (cacheEnabled) {
    fs.mkdirSync(dirname(cacheKeyLocation), { recursive: true });
    const buff = jsonStringify({
      timestamp: Date.now(),
      res,
    });
    log(`Caching data: ${cacheKeyLocation} [${buff.length}]`);
    fs.writeFileSync(cacheKeyLocation, buff);
  }

  return res;
}

/**
 * Loads the envuse file and returns the data source.
 */
export async function load(options: LoadOptions) {
  const res = await loadData(options);

  return {
    dsn: res.dsn,
    data: res.data,
    ...DataSource.parse(res.data),
  };
}
