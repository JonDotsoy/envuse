import { tmpdir } from "os";
import { spawnSync } from "child_process";
import { LoadOptions } from "./load-options";
import fs from "fs";
import { randomUUID } from "crypto";
import path from "path";
import { assertLoadResult } from "./load-result";
import { jsonParse, jsonReviver } from "./json-reviver";
import { DataSource } from "../data-source/data-source";

const workPathTs = `${__dirname}/load-sync-work.ts`;
const workPathJs = `${__dirname}/load-sync-work.js`;

export function loadDataSync(options: LoadOptions) {
  const isTs = path.extname(__filename) === ".ts";
  const ERROR_DIR = `${tmpdir()}/${randomUUID()}`;
  const LOAD_REPORT_PATH = `${ERROR_DIR}/load-report.json`;
  const ERROR_REPORT_PATH = `${ERROR_DIR}/error-report.json`;

  const clearCache = () => {
    if (fs.existsSync(LOAD_REPORT_PATH)) fs.unlinkSync(LOAD_REPORT_PATH);
    if (fs.existsSync(ERROR_REPORT_PATH)) fs.unlinkSync(ERROR_REPORT_PATH);
    if (fs.existsSync(ERROR_DIR)) fs.rmdirSync(ERROR_DIR);
  };

  const b = spawnSync(
    isTs ? "ts-node" : "node",
    [isTs ? workPathTs : workPathJs],
    {
      stdio: "inherit",
      cwd: process.cwd(),
      env: {
        ...process.env,
        __LOAD_REPORT_PATH: LOAD_REPORT_PATH,
        __ERROR_REPORT_PATH: ERROR_REPORT_PATH,
        __OPTIONS: JSON.stringify(options),
      },
      timeout: 20_000,
    }
  );

  if (b.error) {
    throw b.error;
  }

  if (b.status === 100) {
    if (fs.existsSync(ERROR_REPORT_PATH)) {
      const contentErrorReport = fs.readFileSync(ERROR_REPORT_PATH, "utf8");
      clearCache();
      throw jsonParse(contentErrorReport);
    }
  }

  const report = JSON.parse(
    fs.readFileSync(LOAD_REPORT_PATH, "utf8"),
    jsonReviver
  );
  clearCache();

  assertLoadResult(report);

  return report;
}

export function loadSync(options: LoadOptions) {
  const res = loadDataSync(options);

  return {
    dsn: res.dsn,
    data: res.data,
    ...DataSource.parse(res.data),
  };
}
