import { Engine } from './Engine';
import dotenv from 'dotenv';
import { EnvuseConfigStore, TypeEnvConfig } from '../EnvConfigStore';
export declare class LocalEngine implements Engine {
    insert(configStore: EnvuseConfigStore, pathFileName: string): {
        type: TypeEnvConfig;
        name: string;
        pathFileOrigin: string;
        config: dotenv.DotenvParseOutput;
    };
}
