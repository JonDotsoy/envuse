import { CommandModule } from 'yargs';
import chalk from 'chalk';
import inquirer from 'inquirer';
import ow from 'ow';
import { getConfigStore } from '../../../lib/getConfigStore';
import { HerokuEngine } from '../../../lib/engines/HerokuEngine';
import { TypeEnvConfig } from '../../../lib/EnvConfigStore';

type c = CommandModule<{}, {
  app?: string;
  cwd: string;
  'heroku-app'?: string;
}>;

export = <c>{
  command: 'heroku [heroku-app]',
  describe: 'Added ennviroment from heroku',
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
    const defaultHerokuApp = args.app || args["heroku-app"];

    const { configStore, saveConfigStore } = getConfigStore(args.cwd);
    const heroku = new HerokuEngine();

    const {
      herokuApp = defaultHerokuApp as string,
    } = await inquirer.prompt({
      name: 'herokuApp',
      message: 'Heroku App',
      type: 'input',
      default: defaultHerokuApp,
      when: !defaultHerokuApp,
    });

    ow(herokuApp, 'heroku app name', ow.string.nonEmpty);

    const resource = await heroku.insert(configStore, herokuApp);

    console.log(chalk`env heroku {green ${herokuApp}} added ☑`);

    saveConfigStore();

    configStore.defaultSelect(TypeEnvConfig.heroku, resource.name);
  },
};
