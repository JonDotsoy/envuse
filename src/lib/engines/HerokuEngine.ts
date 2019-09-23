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
    const defaultconfig = dotenv.parse(this.cmd(`config -a "${herokuApp}" --shell`, true).toString());

    configStore.setOriginResource({
      type: TypeEnvConfig.heroku,
      name: herokuApp,
      config: defaultconfig,
    });
  }
}
