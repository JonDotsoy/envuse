import { EnvuseConfigStore } from "../EnvConfigStore";

export interface Engine {
  insert(configStore: EnvuseConfigStore, ...args: any): any;
}
