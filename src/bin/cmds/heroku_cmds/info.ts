import yargs, { CommandModule } from 'yargs';
import chalk from 'chalk';
import inquirer from 'inquirer';
import { execSync } from 'child_process';
import { TypeEnvConfig } from '../../../lib/EnvConfigStore';
import dotenv from 'dotenv';
import { getConfigStore } from "../../getConfigStore";
import { EOL } from 'os';

type c = CommandModule<{}, {
  app?: string;
  cwd: string;
}>;

export = <c>{
  command: 'info',
  describe: 'info ennviroment',
  aliases: 'i',
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

    console.log(
      Object.entries(defaultconfig).map(([k, v]) => chalk`{green ${k}}= ${v}`).join(EOL),
    );

    // configStore.setOriginResource({
    //   type: TypeEnvConfig.heroku,
    //   name: herokuApp,
    //   config: defaultconfig,
    // });

    // console.log(chalk`env heroku {green ${herokuApp}} added ☑`);

    saveConfigStore();
  },
};
