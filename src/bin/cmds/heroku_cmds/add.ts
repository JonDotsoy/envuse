import yargs, { CommandModule } from 'yargs';
import chalk from 'chalk';
import inquirer from 'inquirer';
import { execSync } from 'child_process';
import { TypeEnvConfig } from '../../../lib/EnvConfigStore';
import dotenv from 'dotenv';
import { getConfigStore } from "../../getConfigStore";

type c = CommandModule<{}, {
  app?: string;
  cwd: string;
}>;

export = <c>{
  command: 'add',
  describe: 'Added ennviroment from heroku',
  aliases: 'a',
  builder: {
    cwd: {
      type: 'string',
      default: process.cwd(),
    },
    app: {
      alias: 'a',
      type: 'string',
      describe: 'heroku app name',
      required: false,
    },
  },
  async handler(args) {
    const { configStore, saveConfigStore } = getConfigStore(args.cwd);

    const { herokuApp } = args.app ? { herokuApp: args.app } : await inquirer.prompt({
      name: 'herokuApp',
      message: 'Heroku App',
      type: 'input',
      default: args.app,
    });

    const cmd = `heroku config -a "${herokuApp}" --shell`;

    const defaultconfig = dotenv.parse(execSync(cmd).toString());
    configStore.setOriginResource({
      type: TypeEnvConfig.heroku,
      name: herokuApp,
      config: defaultconfig,
    });

    console.log(chalk`env heroku {green ${herokuApp}} added ☑`);

    saveConfigStore();
  },
};
