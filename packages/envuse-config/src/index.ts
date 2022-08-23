import { ConfigContext } from "./config";
import dotenv from "dotenv";
export { ConfigContext } from "./config";

export const globalCtxConfig = new ConfigContext({
  originConfigs: process.env,
});
export const config = globalCtxConfig.config.bind(globalCtxConfig);
export const e = config(".envuse", {
  originConfigs: {
    ...process.env,
    ...dotenv.config().parsed,
  },
}).config;
