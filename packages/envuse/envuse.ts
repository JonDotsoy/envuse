export { load, loadData } from "./load/load";
export { loadSync, loadDataSync } from "./load/load-sync";
export { DataSource } from "./data-source/data-source";
import { deprecate } from "util";
import { DataSource, Option, Values } from "./data-source/data-source";
import { BlockType } from "./data-source/statements/components/block";
import { loadSync } from "./load/load-sync";

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

export function register() {
  const ENVUSE_DSN = process.env.ENVUSE_DSN ?? `${process.cwd()}/.envuse`;
  const ENVUSE_CACHE = (process.env.ENVUSE_CACHE ?? "true") === "true";
  const ENVUSE_CACHE_TTL_str = Number(process.env.ENVUSE_CACHE_TTL);
  const ENVUSE_CACHE_TTL = !Number.isNaN(ENVUSE_CACHE_TTL_str)
    ? ENVUSE_CACHE_TTL_str
    : undefined;

  const res = loadSync({
    dsn: ENVUSE_DSN,
    dsnHttpHeaders: Object.fromEntries(getEnvEnvuseHeaders()),
    cache: {
      enable: ENVUSE_CACHE,
      ttl: ENVUSE_CACHE_TTL,
    },
    values: process.env,
  });

  console.log(res.parsed);
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
