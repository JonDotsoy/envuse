import { PathOrFileDescriptor, WriteFileOptions, writeFileSync } from "fs";
import { jsonReplacer, jsonStringify } from "./json-replacer";
import { loadData } from "./load";
import { assertsLoadOptions } from "./types/load-options";
import debug from "debug";
import path from "path";
import fs from "fs";

const log = debug("envuse:load:load-sync-worker");

const __LOAD_REPORT_PATH = process.env.__LOAD_REPORT_PATH;
const __ERROR_REPORT_PATH = process.env.__ERROR_REPORT_PATH;
const __OPTIONS = process.env.__OPTIONS;

if (!__LOAD_REPORT_PATH) {
  throw new Error("__LOAD_REPORT_PATH is not defined");
}

if (!__ERROR_REPORT_PATH) {
  throw new Error("__ERROR_REPORT_PATH is not defined");
}

if (!__OPTIONS) {
  throw new Error("__OPTIONS is not defined");
}

const writeJsonFile = (file: string, data: any, options?: WriteFileOptions) => {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, jsonStringify(data), options);
};

const main = async () => {
  log("Start load-sync-worker");
  log(`  __LOAD_REPORT_PATH = %s`, __LOAD_REPORT_PATH);
  log(`  __ERROR_REPORT_PATH = %s`, __ERROR_REPORT_PATH);
  log(`  __OPTIONS = %s`, __OPTIONS);

  const options = JSON.parse(__OPTIONS);
  assertsLoadOptions(options);
  const res = await loadData({ ...options, cache: { enable: false } });
  await writeJsonFile(__LOAD_REPORT_PATH, res);
};

main().catch((err) => {
  writeJsonFile(__ERROR_REPORT_PATH, err);

  process.exit(100);
});
