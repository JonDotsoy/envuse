import { Engine } from './Engine';
import { execSync } from 'child_process';
import dotenv from 'dotenv';
import { EnvuseConfigStore, TypeEnvConfig } from '../EnvConfigStore';
import path from 'path';
import { readFileSync } from 'fs';

export class LocalEngine implements Engine {
  insert(configStore: EnvuseConfigStore, pathFileName: string) {
    const pathFile = path.resolve(pathFileName);

    const defaultconfig = dotenv.parse(readFileSync(pathFile, 'utf8'));

    const resource = {
      type: TypeEnvConfig.local,
      name: pathFile,
      pathFileOrigin: pathFileName,
      config: defaultconfig,
    };

    configStore.setOriginResource(resource);

    return resource;
  }
}
