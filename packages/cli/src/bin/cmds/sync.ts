import { CommandModule } from "yargs";
import { getConfigStore } from "../../lib/getConfigStore";
import chalk from "chalk";
import { TypeEnvConfig } from "../../lib/EnvConfigStore";
import { HerokuEngine } from "../../lib/engines/HerokuEngine";
import { LocalEngine } from "../../lib/engines/LocalEngine";

type c = CommandModule<
  {},
  {
    cwd: string;
  }
>;

export = <c>{
  command: "sync",
  describe: "sync all configs",
  builder: {
    cwd: {
      type: "string",
      default: process.cwd(),
    },
  },
  handler: async (args) => {
    const { configStore, saveConfigStore } = getConfigStore(args.cwd);

    const heroku = new HerokuEngine();
    const local = new LocalEngine();

    const envs = configStore.listEnvs();

    for (const env of envs) {
      console.log(chalk`Sync {green ${env.name}} ...`);

      if (env.type === TypeEnvConfig.heroku) {
        heroku.insert(configStore, env.name);
      }
      if (env.type === TypeEnvConfig.local) {
        local.insert(configStore, env.name);
      }
    }

    saveConfigStore();
  },
};
