import yargs, { CommandModule } from 'yargs';
import chalk from 'chalk';
import inquirer from 'inquirer';
import { execSync } from 'child_process';
import { TypeEnvConfig } from '../../../lib/EnvConfigStore';
import dotenv from 'dotenv';
import { getConfigStore } from "../../getConfigStore";
import { HerokuEngine } from '../../../lib/engines/HerokuEngine';
import ow from 'ow';

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
    const heroku = new HerokuEngine();

    const {
      herokuApp = args.app as string,
    } = await inquirer.prompt({
      name: 'herokuApp',
      message: 'Heroku App',
      type: 'input',
      default: args.app,
      when: !args.app,
    });

    ow(herokuApp, 'p', ow.string);

    await heroku.insert(configStore, herokuApp);

    console.log(chalk`env heroku {green ${herokuApp}} added ☑`);

    saveConfigStore();
  },
};
