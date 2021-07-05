import { Engine } from './Engine';
import { execSync } from 'child_process';
import dotenv from 'dotenv';
import { EnvuseConfigStore, TypeEnvConfig } from '../EnvConfigStore';

export class HerokuEngine implements Engine {
  cmd(cmd: string, log = false) {
    const cmdHeroku = `heroku ${cmd}`;
    if (log) {
      console.log(`RUN: $ ${cmdHeroku}`);
    }
    return execSync(cmdHeroku);
  }

  insert(configStore: EnvuseConfigStore, herokuApp: string) {
    const defaultconfig = JSON.parse(this.cmd(`config -a "${herokuApp}" --json`, true).toString());

    const resource = {
      type: TypeEnvConfig.heroku,
      name: herokuApp,
      config: defaultconfig,
    };

    configStore.setOriginResource(resource);

    return resource;
  }
}
