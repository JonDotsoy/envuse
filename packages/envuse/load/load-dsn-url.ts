import { URL } from "url";
import axios from "axios";
import contentType from "content-type";
import { DataSource } from "../data-source/data-source";
import { loadResult } from "./load-result";
import { LoadOptions } from "./load-options";
import debug from "debug";

const log = debug("envuse:load:load-dsn-url");

export async function loadDsnUrl(
  dsn: URL,
  options: LoadOptions
): Promise<loadResult> {
  const ignoreTypeValidation = options.ignoreTypeValidation || false;

  const headers = {
    ...options.dsnHttpHeaders,
    Accept: "application/envuse",
  };

  log(`Pull configuration`);
  const l = (v: string) => v.padStart(15, " ");
  log(`${l(`Download DSN`)}: ${dsn.href}`);
  log(`${l(`HTTP Header`)}:`);

  Object.entries(headers).forEach(([key, value]) => {
    log(`${l("")} ${key} = ${value}`);
  });

  const downloadStart = Date.now();
  const res = await axios.get<Buffer>(dsn.href, {
    headers: headers,
    validateStatus: (statusCode) => statusCode === 200,
    responseType: "arraybuffer",
    timeout: 10_000,
  });
  const downloadEnd = Date.now();
  const downloadDurationSec = ((downloadEnd - downloadStart) / 1000).toFixed(3);

  log(`Done downloading in ${downloadDurationSec}s [${res.status}]`);

  const contentTypeHeader = res.headers["content-type"]
    ? contentType.parse(res.headers["content-type"])
    : undefined;

  if (!ignoreTypeValidation) {
    if (contentTypeHeader?.type !== "application/envuse") {
      throw new Error(
        `Expected content-type to be application/envuse, got ${contentTypeHeader?.type}`
      );
    }
  }

  return {
    dsn: dsn.href,
    data: res.data,
  };
}
