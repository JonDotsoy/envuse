import { createHash } from "crypto";
import { readFileSync } from "fs";
import { tmpdir } from "os";
import { jsonParse } from "./json-reviver";
import { isLoadResult, loadResult } from "./load-result";
import { LoadOptions } from "./types/load-options";
import debug from "debug";
import { parse } from "path/posix";
import { typesValues } from "../data-source/statements/components/types-values";
import util from "util";
import fs from "fs";
import path from "path";
import { jsonStringify } from "./json-replacer";

const log = debug("envuse:cache-load-data");

interface CacheResult {
  timestamp: number;
  loadResult: loadResult;
}

function hasKey<
  O extends { [k: string]: any },
  K extends string,
  T extends "number" | "object"
>(
  obj: O,
  key: K,
  type: T
): obj is O &
  {
    [P in K]: T extends "number"
      ? number
      : T extends "object"
      ? object
      : unknown;
  } {
  if (typeof obj === "object" && key in obj && typeof obj[key] === type) {
    return true;
  }
  return false;
}

function parseCacheResult(data: string): CacheResult | null {
  let parsed: unknown;

  try {
    parsed = jsonParse(data);
  } catch (ex) {}

  if (typeof parsed === "object") {
    if (parsed === null) return null;

    if (
      hasKey(parsed, "timestamp", "number") &&
      hasKey(parsed, "loadResult", "object")
    ) {
      const loadResult = parsed.loadResult;
      if (isLoadResult(loadResult)) {
        return {
          ...parsed,
          loadResult,
        };
      }
    }
  }

  return null;
}

export function cacheLoadData<R extends Promise<loadResult> | loadResult>(
  options: LoadOptions,
  loadDataFunction: () => R
): R {
  const cacheEnabled = options.cache?.enable ?? true;
  const hashDSN = createHash("md5").update(options.dsn).digest("hex");
  const cacheKeyLocation =
    options.cache?.filePath ??
    `${tmpdir()}/.envuse-cache-reports/${hashDSN}.json`;
  const time10minutes = 600000;
  const cacheTtl = options.cache?.ttl ?? time10minutes;

  if (cacheEnabled) {
    if (fs.existsSync(cacheKeyLocation)) {
      const cachedData = readFileSync(cacheKeyLocation, "utf8");
      log(`Read cache file ${cacheKeyLocation} [%d bytes]`, cachedData.length);
      const parsed = parseCacheResult(cachedData);
      if (!parsed) {
        log(`Cache file ${cacheKeyLocation} is invalid`);
      } else {
        const { timestamp, loadResult } = parsed;
        if (Date.now() - timestamp < cacheTtl) {
          log(`Cache hit!`);
          return loadResult as R;
        } else {
          log(`Cache expired!`);
        }
      }
    }
  }

  const saveCache = (cacheResult: CacheResult) => {
    if (cacheEnabled) {
      const buff = Buffer.from(jsonStringify(cacheResult));
      log(`Writing cache file %s [%d bytes]`, cacheKeyLocation, buff.length);
      fs.mkdirSync(path.dirname(cacheKeyLocation), { recursive: true });
      fs.writeFileSync(cacheKeyLocation, buff);
      log(`Wrote cache file ${cacheKeyLocation}`);
    }
  };

  const resultLoadData = loadDataFunction();

  if (util.types.isPromise(resultLoadData)) {
    return resultLoadData.then((loadResult) => {
      saveCache({
        timestamp: Date.now(),
        loadResult,
      });
      return loadResult;
    }) as R;
  } else {
    saveCache({
      timestamp: Date.now(),
      loadResult: resultLoadData,
    });
    return resultLoadData as R;
  }
}
