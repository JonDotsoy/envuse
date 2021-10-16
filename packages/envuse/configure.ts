import { AsyncLocalStorage } from "async_hooks";

class Configuration {
  constructor(config?: Partial<Configuration>) {
    Object.assign(this, config);
  }
}

const globalConfiguration = new Configuration();

const configureStore = new AsyncLocalStorage<Configuration>();

export const getConfiguration = () =>
  configureStore.getStore() ?? globalConfiguration;

export const configure = (cb: (configurationLoad: Configuration) => void) =>
  cb(getConfiguration());

export const withConfiguration = <R>(
  config: Partial<Configuration>,
  cb: () => R
) => configureStore.run(new Configuration(config), cb);
