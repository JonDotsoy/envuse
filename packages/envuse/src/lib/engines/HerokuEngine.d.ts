/// <reference types="node" />
import { Engine } from './Engine';
import { EnvuseConfigStore, TypeEnvConfig } from '../EnvConfigStore';
export declare class HerokuEngine implements Engine {
    cmd(cmd: string, log?: boolean): Buffer;
    insert(configStore: EnvuseConfigStore, herokuApp: string): {
        type: TypeEnvConfig;
        name: string;
        config: any;
    };
}
