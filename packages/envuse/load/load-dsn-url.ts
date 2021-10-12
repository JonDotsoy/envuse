import { URL } from "url";
import axios from "axios";
import contentType from "content-type";
import { DataSource } from "../data-source/data-source";
import { loadResult } from "./load-result";
import { LoadOptions } from "./load-options";

export async function loadDsnUrl(
  dsn: URL,
  options: LoadOptions
): Promise<loadResult> {
  const ignoreTypeValidation = options.ignoreTypeValidation || false;

  const res = await axios.get<Buffer>(dsn.href, {
    headers: {
      ...options.dsnHttpHeaders,
      Accept: "application/envuse",
    },
    validateStatus: (statusCode) => statusCode === 200,
    responseType: "arraybuffer",
  });

  const contentTypeHeader = res.headers["content-type"]
    ? contentType.parse(res.headers["content-type"])
    : undefined;
  // const contentTypeHeaderParameterEncode = contentTypeHeader?.parameters.encode ?? 'utf-8';
  // const encode = Buffer.isEncoding(contentTypeHeaderParameterEncode) ? contentTypeHeaderParameterEncode : 'utf-8';
  if (!ignoreTypeValidation) {
    if (contentTypeHeader?.type !== "application/envuse") {
      throw new Error(
        `Expected content-type to be application/envuse, got ${contentTypeHeader?.type}`
      );
    }
  }

  return {
    dsn: dsn.href,
    ...DataSource.parse(res.data),
  };
}
