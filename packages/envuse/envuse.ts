export { load, loadData } from "./load/load";
export { loadSync, loadDataSync } from "./load/load-sync";
export { DataSource } from "./data-source/data-source";
import { deprecate } from "util";
import {
  DataSource,
  Definition,
  Option,
  Values,
} from "./data-source/data-source";
import { BlockType } from "./data-source/statements/components/block";
import { loadSync } from "./load/load-sync";
import { LoadOptions } from "./load/types/load-options";
import fs, { accessSync } from "fs";
import path, { relative } from "path";
import debug from "debug";
import { cwd } from "process";

const log = debug("envuse:register");

type Definitions = {
  [k: string]: Definition | undefined;
};

let globalDefinitionsRequired: Definitions | undefined;

const Config = () =>
  new Proxy<{ [key: string]: any }>(
    {},
    {
      get(_target, key, _receiver) {
        if (typeof key === "string") {
          return globalDefinitionsRequired?.[key]?.value ?? undefined;
        }
        return undefined;
      },
    }
  );

const defaultConfig = Config();
export default defaultConfig;

function getEnvEnvuseHeaders() {
  return Object.entries(process.env)
    .filter(
      (entry): entry is [`ENVUSE_HEADER_${string}`, string] =>
        entry[0].startsWith("ENVUSE_HEADER_") && !!entry[1]
    )
    .map(
      ([key, value]) => [key.replace(/^ENVUSE_HEADER_/, ""), value] as const
    );
}

interface EnvuseSelector {
  dsn?: string;
  other_dsn?: {
    [key: string]: string;
  };
}

function validateEnvuseSelector(
  relativePath: string,
  value: any
): asserts value is EnvuseSelector {
  try {
    if (typeof value !== "object" || value === null)
      throw new Error(
        `${relativePath}: . Expected object, got ${typeof value}`
      );
    if (value.dsn && typeof value.dsn !== "string")
      throw new Error(
        `${relativePath}: .dsn Expected string, got ${typeof value.dsn}`
      );
    if (value.other_dsn) {
      if (typeof value.other_dsn !== "object")
        throw new Error(
          `${relativePath}: .other_dsn Expected object, got ${typeof value.other_dsn}`
        );
      Object.entries(value.other_dsn ?? {}).forEach(([key, value]) => {
        if (typeof value !== "string")
          throw new Error(
            `${relativePath}: .other_dsn.${key}: Expected string, got ${typeof value}`
          );
      });
    }
  } catch (ex) {
    if (ex instanceof Error) {
      Error.captureStackTrace(ex, validateEnvuseSelector);
    }
    throw ex;
  }
}

function loadEnvuseSelector(envuseSelectorFilePath: string) {
  const envuseSelectorFilePathRelative = relative(
    cwd(),
    envuseSelectorFilePath
  );
  if (fs.existsSync(envuseSelectorFilePath)) {
    const stat = fs.statSync(envuseSelectorFilePath);

    // log warn file with error permision use `chmod 300 .envuse-selector.json` in console.
    if ((stat.mode & 0o777).toString(8).padStart(4, "0") !== "0600") {
      console.warn(
        `${envuseSelectorFilePathRelative} has error permission. Use chmod 600 to fix.`
      );
      return null;
    }

    const envuseSelector = require(envuseSelectorFilePath);
    validateEnvuseSelector(envuseSelectorFilePathRelative, envuseSelector);

    log(
      `Loaded envuse selector from %s`,
      relative(cwd(), envuseSelectorFilePathRelative)
    );

    return {
      dsn: envuseSelector.dsn,
    };
  }

  return null;
}

export function register(options?: Partial<LoadOptions>) {
  const ENVUSE_SELECTOR = `${process.cwd()}/.envuse-selector.json`;

  const envuseSelector = loadEnvuseSelector(ENVUSE_SELECTOR);

  const localEnvuseFile = `${process.cwd()}/.envuse` as const;

  const ENVUSE_DSN =
    envuseSelector?.dsn ?? process.env.ENVUSE_DSN ?? localEnvuseFile;
  const ENVUSE_CACHE = (process.env.ENVUSE_CACHE ?? "true") === "true";
  const ENVUSE_CACHE_TTL_str = Number(process.env.ENVUSE_CACHE_TTL);
  const ENVUSE_CACHE_TTL = !Number.isNaN(ENVUSE_CACHE_TTL_str)
    ? ENVUSE_CACHE_TTL_str
    : undefined;

  if (ENVUSE_DSN === localEnvuseFile) {
    if (!fs.existsSync(localEnvuseFile)) {
      log(
        "Ignore loading local envuse file %s",
        relative(cwd(), localEnvuseFile)
      );
      return;
    }
  }

  const res = loadSync({
    ...options,
    dsn: options?.dsn ?? ENVUSE_DSN,
    dsnHttpHeaders: {
      ...Object.fromEntries(getEnvEnvuseHeaders()),
      ...options?.dsnHttpHeaders,
    },
    cache: {
      ...options?.cache,
      enable: options?.cache?.enable ?? ENVUSE_CACHE,
      ttl: options?.cache?.ttl ?? ENVUSE_CACHE_TTL,
    },
    values: {
      ...process.env,
      ...options?.values,
    },
  });

  globalDefinitionsRequired = res.definitions;

  return res;
}

export const parse = deprecate((option: Option, values?: Values) => {
  return DataSource.parse(option, values);
}, "envuse.parse is deprecated. Use envuse.load instead.");

export const parseFile = deprecate((filepath: string, values: Values) => {
  return DataSource.parseFile(filepath, values);
}, "envuse.parseFile is deprecated. Use envuse.load instead.");

export const createDataSource = deprecate((option: Option) => {
  return DataSource.createDataSource(option);
}, "envuse.createDataSource is deprecated. Use envuse.DataSource.createDataSource instead.");

export const stringify = deprecate((comp: BlockType) => {
  return DataSource.stringify(comp);
}, "envuse.stringify is deprecated. Use envuse.DataSource.stringify instead.");
