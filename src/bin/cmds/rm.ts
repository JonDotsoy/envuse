import { CommandModule } from "yargs";
import { getConfigStore } from "../../lib/getConfigStore";
import chalk from "chalk";
import path from "path";
import { TypeEnvConfig } from "../../lib/EnvConfigStore";
import { HerokuEngine } from "../../lib/engines/HerokuEngine";
import { LocalEngine } from "../../lib/engines/LocalEngine";
import inquirer from 'inquirer';

type c = CommandModule<{}, {
  cwd: string,
  config: string,
}>;

export = <c>{
  command: 'rm',
  describe: 'remove configs',
  builder: {
    cwd: {
      type: 'string',
      default: process.cwd(),
    }
  },
  handler: async (args) => {
    const { configStore, saveConfigStore } = getConfigStore(args.cwd);

    if (configStore.listEnvs().length === 0) {
      console.log(chalk`Not found envs`);
      return;
    }

    const { configSelected } = await inquirer.prompt({
      name: 'configSelected',
      type: 'list',
      choices: [
        ...configStore.listEnvs().map((c) => ({
          value: c.id,
          name: c.name,
        }))
      ],
    });

    configStore.removeEnv(configSelected);

    console.log(chalk`Config removed {green ${configSelected}}`);

    saveConfigStore();
  },
}