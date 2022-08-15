import { readFileSync, writeFileSync } from "fs";
import { pathToFileURL } from "url";
import { describeDeclaration } from "./declaration";
import { EvaluationError } from "./errors/evaluation-error";
import { evaluate, listConfigTypes } from "./evaluation";
import { parse } from "./parse";
import { updateDeclarationPayload } from "./update-declaration-payload";

const readFileSyncUnwrapOr = <A>(
  path: string,
  encoding: BufferEncoding,
  or: A
) => {
  try {
    return readFileSync(path, encoding);
  } catch {
    return or;
  }
};

type options = {
  originConfigs?: Record<string, string | null | undefined>;
};

type optionsConfigContext = {
  originConfigs?: Record<string, string | null | undefined>;
  locationTypes?: null | string;
};

export class ConfigContext<O = listConfigTypes> {
  locationTypes: string | null;

  constructor(private ctxOptions?: optionsConfigContext) {
    this.locationTypes =
      ctxOptions?.locationTypes === null
        ? null
        : ctxOptions?.locationTypes ?? `${__dirname}/../list-config-types.d.ts`;
  }

  config<K extends string = ".envuse">(
    path: K = ".envuse" as K,
    opts?: options
  ) {
    const originConfigs = opts?.originConfigs ?? this.ctxOptions?.originConfigs;
    const envuseLocation = pathToFileURL(path);
    const payload = readFileSyncUnwrapOr(path, "utf-8", "");
    const doc = parse(payload);
    const declaration = describeDeclaration(doc);

    if (this.locationTypes)
      writeFileSync(
        this.locationTypes,
        updateDeclarationPayload(
          readFileSyncUnwrapOr(this.locationTypes, "utf-8", ""),
          path,
          declaration
        )
      );

    try {
      return evaluate<K, O>(declaration, originConfigs ?? {}, {
        location: envuseLocation,
      });
    } catch (ex) {
      if (ex instanceof EvaluationError) {
        Error.captureStackTrace(ex, ConfigContext.prototype.config);
      }
      throw ex;
    }
  }
}
