import { ConfigContext } from "./config";
export { ConfigContext } from "./config";

export const globalCtxConfig = new ConfigContext({
  originConfigs: process.env,
});
export const config = globalCtxConfig.config.bind(globalCtxConfig);
