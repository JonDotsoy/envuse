export { load, loadData } from "./load/load";
export { loadSync, loadDataSync } from "./load/load-sync";
import { loadSync } from "./load/load-sync";

export function register() {
  const ENVUSE_DSN = process.env.ENVUSE_DSN ?? `${process.cwd()}/.envuse`;
  const ENVUSE_CACHE = (process.env.ENVUSE_CACHE ?? "true") === "true";

  const envsHeaders = Object.entries(process.env)
    .filter(
      (entry): entry is [`ENVUSE_HEADER_${string}`, string] =>
        entry[0].startsWith("ENVUSE_HEADER_") && !!entry[1]
    )
    .map(
      ([key, value]) => [key.replace(/^ENVUSE_HEADER_/, ""), value] as const
    );

  loadSync({
    dsn: ENVUSE_DSN,
    dsnHttpHeaders: Object.fromEntries(envsHeaders),
    cache: {
      enable: ENVUSE_CACHE,
    },
  });
}
